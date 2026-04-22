#!/usr/bin/env node
/**
 * Libby Live Local Server
 *
 * Runs on Toshiba laptop (or any local machine) and serves:
 * - Floating widget HTML
 * - Chat endpoint
 * - Real-time transcript ingestion
 *
 * Usage:
 *   node libby-local-server.js
 *
 * Then access: http://localhost:3000/floating-widget.html
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_ROOT = process.env.DATA_ROOT || path.join(__dirname, 'data');

// Simple JSON response helper
function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  };
}

// Simple HTML response helper
function htmlResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' },
    body,
  };
}

// Load the floating widget HTML
function loadWidget() {
  const widgetPath = path.join(__dirname, 'floating-widget.html');
  if (!fs.existsSync(widgetPath)) {
    return `<h1>Widget not found</h1><p>Missing: ${widgetPath}</p>`;
  }
  return fs.readFileSync(widgetPath, 'utf8');
}

// Chat endpoint - simple stub (future: wire to actual LLM)
async function handleChat(body) {
  const { userId = 'mattherbert01', messages = [] } = body;
  const userMessage = messages[messages.length - 1]?.content || '';

  // Load case context
  const profilePath = path.join(DATA_ROOT, userId, 'profile.md');
  let context = 'Loading case context...';
  if (fs.existsSync(profilePath)) {
    context = `Case context loaded for ${userId}`;
  }

  // Stub response (in Phase 2, connect to OpenRouter)
  return jsonResponse(200, {
    reply: `Libby: I heard you say "${userMessage}". Transcript saved. [Stub response - Phase 2: wire to LLM]`,
    model: 'local-stub',
    context,
    knowledge_loaded: fs.existsSync(profilePath),
  });
}

// Ingest transcript endpoint
async function handleIngestTranscript(body) {
  const { userId = 'mattherbert01', transcript, location, contacts = [], timestamp = new Date().toISOString() } = body;

  try {
    const userRoot = path.join(DATA_ROOT, userId);
    const transcriptsDir = path.join(userRoot, 'transcripts');

    if (!fs.existsSync(transcriptsDir)) {
      fs.mkdirSync(transcriptsDir, { recursive: true });
    }

    const date = new Date(timestamp);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toISOString().split('T')[1].split('.')[0];
    const filename = `transcript_${dateStr}_${timeStr.replace(/:/g, '-')}.md`;
    const filepath = path.join(transcriptsDir, filename);

    const transcriptContent = `# Transcript — ${date.toLocaleString()}

**Location**: ${location ? `${location.lat}, ${location.lng}` : 'Unknown'}
**Attendees**: ${contacts.length > 0 ? contacts.join(', ') : 'None recorded'}

---

${transcript}

---

**Status**: Ingested via Libby Live Local Server (Real-time)
**Timestamp**: ${timestamp}
`;

    fs.writeFileSync(filepath, transcriptContent, 'utf8');

    // Update correspondence ledger
    const correspondenceFile = path.join(userRoot, 'ledgers', 'correspondence.csv');
    if (fs.existsSync(correspondenceFile)) {
      const now = new Date();
      const dateFormatted = now.toISOString().split('T')[0];
      const timeFormatted = now.toISOString().split('T')[1].substring(0, 5);
      const newRow = `${dateFormatted} ${timeFormatted},incoming,${contacts.join('; ') || 'Meeting'},N/A,Meeting Transcript,audio/transcription,"Transcribed from real-time audio; location: ${location ? location.lat + ',' + location.lng : 'unknown'}",high,local-server`;

      let csv = fs.readFileSync(correspondenceFile, 'utf8');
      if (!csv.endsWith('\n')) csv += '\n';
      fs.writeFileSync(correspondenceFile, csv + newRow + '\n', 'utf8');
    }

    return jsonResponse(200, {
      status: 'success',
      message: 'Transcript ingested locally',
      filename,
      savedAt: filepath,
    });
  } catch (error) {
    console.error('Ingest error:', error);
    return jsonResponse(500, { error: error.message || 'Ingestion failed' });
  }
}

// Route handler
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Floating widget HTML
  if (pathname === '/' || pathname === '/floating-widget.html') {
    const widget = loadWidget();
    const response = htmlResponse(200, widget);
    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
    return;
  }

  // Chat endpoint
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body);
        const response = await handleChat(parsedBody);
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      } catch (err) {
        const response = jsonResponse(400, { error: 'Invalid JSON' });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      }
    });
    return;
  }

  // Ingest transcript endpoint
  if (pathname === '/api/ingest-transcript' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body);
        const response = await handleIngestTranscript(parsedBody);
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      } catch (err) {
        const response = jsonResponse(400, { error: 'Invalid JSON' });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      }
    });
    return;
  }

  // 404
  const response = jsonResponse(404, { error: 'Not found' });
  res.writeHead(response.statusCode, response.headers);
  res.end(response.body);
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  Libby Live Local Server Running                   ║
╠════════════════════════════════════════════════════╣
║  🔗 http://localhost:${PORT}                            ║
║  📱 Access from phone: http://<your-ip>:${PORT}  ║
║                                                    ║
║  Endpoints:                                        ║
║  • GET  / or /floating-widget.html                 ║
║  • POST /api/chat                                  ║
║  • POST /api/ingest-transcript                     ║
║                                                    ║
║  Data root: ${DATA_ROOT}              ║
║                                                    ║
║  Press Ctrl+C to stop                              ║
╚════════════════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});
