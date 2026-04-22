'use strict';

/**
 * Parses CSV text into an array of objects using the first row as headers.
 * Handles quoted fields (including those containing commas and newlines).
 */
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = splitCSVRows(lines);
  if (rows.length < 2) return [];

  const headers = parseCSVRow(rows[0]).map(h => h.trim());

  return rows.slice(1)
    .map(row => parseCSVRow(row))
    .filter(cols => cols.some(c => c.trim()))
    .map(cols => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (cols[i] || '').trim();
      });
      return obj;
    });
}

function splitCSVRows(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === '\n' && !inQuotes) {
      rows.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) rows.push(current);
  return rows.filter(r => r.trim());
}

function parseCSVRow(row) {
  const cols = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current);
  return cols;
}

/**
 * Reads an evidence_ledger.csv and returns structured evidence entries.
 */
function readEvidenceLedger(text) {
  return parseCSV(text).map(row => ({
    date: row.date || row.Date || '',
    document_type: row.document_type || row['Document Type'] || '',
    title: row.title || row.Title || '',
    establishes: row.establishes || row.Establishes || '',
    confidence: row.confidence || row.Confidence || 'Pending',
    location: row.location || row.Location || '',
    notes: row.notes || row.Notes || '',
  }));
}

/**
 * Reads a call_history_normalized.csv into structured call records.
 */
function readCallHistory(text) {
  return parseCSV(text).map(row => ({
    date: row.date || row.Date || '',
    time: row.time || row.Time || '',
    duration: row.duration || row.Duration || '',
    direction: row.direction || row.Direction || '',
    contact: row.contact || row.Contact || row.contact_name || '',
    notes: row.notes || row.Notes || '',
    recording: row.recording || row.recording_file || '',
  }));
}

/**
 * Generic CSV reader — returns raw array of row objects.
 */
function readCSV(text) {
  return parseCSV(text);
}

module.exports = { parseCSV, readEvidenceLedger, readCallHistory, readCSV };
