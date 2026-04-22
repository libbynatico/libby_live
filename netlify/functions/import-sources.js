// Direct import endpoint for Gemini source discovery output
// Accepts structured markdown or JSON from Gemini, parses, validates, stores

const fs = require('fs');
const path = require('path');

const DATA_ROOT = process.env.DATA_ROOT || './data';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { format, content, userID = 'system' } = JSON.parse(event.body);

    if (!format || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing format or content' })
      };
    }

    let parsed;

    if (format === 'markdown') {
      parsed = parseMarkdownReport(content);
    } else if (format === 'json') {
      parsed = JSON.parse(content);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Format must be "markdown" or "json"' })
      };
    }

    // Validate structure
    if (!parsed.files_found && !parsed.files_missing) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid structure: need files_found or files_missing'
        })
      };
    }

    // Store as evidence records
    const sharedDir = path.join(DATA_ROOT, '_shared');
    if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });

    const reportPath = path.join(
      sharedDir,
      `gemini_source_report_${new Date().toISOString().split('T')[0]}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(parsed, null, 2));

    // Log import
    const auditLog = {
      timestamp: new Date().toISOString(),
      action: 'import_sources',
      userID,
      format,
      filesFound: (parsed.files_found || []).length,
      filesMissing: (parsed.files_missing || []).length,
      reportPath,
      status: 'success'
    };

    logAccess(auditLog);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reportPath,
        filesFound: (parsed.files_found || []).length,
        filesMissing: (parsed.files_missing || []).length
      })
    };
  } catch (error) {
    logAccess({
      timestamp: new Date().toISOString(),
      action: 'import_sources',
      error: error.message,
      status: 'failed'
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function parseMarkdownReport(markdown) {
  const result = {
    timestamp: new Date().toISOString(),
    files_found: [],
    files_missing: [],
    summary: {}
  };

  const lines = markdown.split('\n');
  let currentSection = null;
  let currentFile = null;

  for (const line of lines) {
    if (line.includes('## Files Found')) {
      currentSection = 'found';
    } else if (line.includes('## Files Not Found') || line.includes('## Missing')) {
      currentSection = 'missing';
    } else if (line.includes('## Summary')) {
      currentSection = 'summary';
    } else if (line.startsWith('---')) {
      // Start of file block
      currentFile = {};
    } else if (line.startsWith('FILE_ID:') && currentFile) {
      currentFile.file_id = line.split(':')[1].trim();
    } else if (line.startsWith('FILENAME:') && currentFile) {
      currentFile.filename = line.split(':')[1].trim();
    } else if (line.startsWith('DATE:') && currentFile) {
      currentFile.date = line.split(':')[1].trim();
    } else if (line.startsWith('TYPE:') && currentFile) {
      currentFile.type = line.split(':')[1].trim();
    } else if (line.startsWith('RELEVANCE:') && currentFile) {
      currentFile.relevance = line.split(':')[1].trim();
    } else if (line.startsWith('CONFIDENCE:') && currentFile) {
      currentFile.confidence = line.split(':')[1].trim();
    } else if (line.startsWith('FOLDER_PATH:') && currentFile) {
      currentFile.folder_path = line.split(':')[1].trim();
    } else if (line.startsWith('STATUS:') && currentFile) {
      currentFile.status = line.split(':')[1].trim();
      if (currentSection === 'found') {
        result.files_found.push(currentFile);
      }
      currentFile = null;
    } else if (line.startsWith('MISSING_ID:') && currentFile) {
      currentFile.missing_id = line.split(':')[1].trim();
    } else if (line.startsWith('WHAT_SEARCHED:') && currentFile) {
      currentFile.what_searched = line.split(':')[1].trim();
    } else if (line.startsWith('RECOMMENDATION:') && currentFile) {
      currentFile.recommendation = line.split(':')[1].trim();
      if (currentSection === 'missing') {
        result.files_missing.push(currentFile);
      }
      currentFile = null;
    } else if (currentSection === 'summary' && line.includes(':')) {
      const [key, val] = line.split(':');
      result.summary[key.trim()] = val.trim();
    }
  }

  return result;
}

function logAccess(record) {
  const auditPath = path.join(DATA_ROOT, '_system', 'file_access_log.json');
  const dir = path.dirname(auditPath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let logs = [];
  if (fs.existsSync(auditPath)) {
    logs = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  }

  logs.push(record);
  fs.writeFileSync(auditPath, JSON.stringify(logs, null, 2));
}
