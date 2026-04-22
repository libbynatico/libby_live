import path from 'path';
import fs from 'fs';

const DATA_ROOT = process.env.DATA_ROOT || path.join(process.cwd(), 'data');

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { userId = 'mattherbert01', transcript, location, contacts = [], timestamp = new Date().toISOString() } = body;

  try {
    // 1. Save transcript file
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

**Status**: Ingested via Libby Live (Real-time)
**Timestamp**: ${timestamp}
`;

    fs.writeFileSync(filepath, transcriptContent, 'utf8');

    // 2. Update correspondence ledger (stub for real integration)
    const correspondenceFile = path.join(userRoot, 'ledgers', 'correspondence.csv');
    if (fs.existsSync(correspondenceFile)) {
      const now = new Date();
      const dateFormatted = now.toISOString().split('T')[0];
      const timeFormatted = now.toISOString().split('T')[1].substring(0, 5);
      const newRow = `${dateFormatted} ${timeFormatted},incoming,${contacts.join('; ') || 'Meeting'},N/A,Meeting Transcript,audio/transcription,"Transcribed from real-time audio recording; location: ${location ? location.lat + ',' + location.lng : 'unknown'}",high,floating-widget`;

      let csv = fs.readFileSync(correspondenceFile, 'utf8');
      if (!csv.endsWith('\n')) csv += '\n';
      fs.writeFileSync(correspondenceFile, csv + newRow + '\n', 'utf8');
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Transcript ingested',
        filename,
        savedAt: filepath,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Ingest error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Ingestion failed' }),
      { status: 500 }
    );
  }
};
