#!/usr/bin/env node
'use strict';

/**
 * ingest.js — local utility to validate and summarize the private knowledge directory.
 *
 * Usage:
 *   node importers/ingest.js [--data-root /path/to/private/data] [--user mattherbert01]
 *
 * This does NOT upload anything or require any API key.
 * It reads local files and prints a JSON summary of what was found.
 * Run this after copying normalized artifacts into your DATA_ROOT.
 */

const fs = require('fs');
const path = require('path');
const { readEvidenceLedger, readCallHistory, readCSV } = require('./csv_reader');
const { readProfileMarkdown, readTimelineMarkdown, readTranscriptMarkdown } = require('./markdown_reader');

const args = process.argv.slice(2);
const dataRootArg = args.indexOf('--data-root');
const userArg = args.indexOf('--user');
const DATA_ROOT = dataRootArg !== -1 ? args[dataRootArg + 1] : (process.env.DATA_ROOT || path.join(__dirname, '..', 'data'));
const USER_ID = userArg !== -1 ? args[userArg + 1] : 'patient_zero';

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function ingestUser(userId) {
  const userRoot = path.join(DATA_ROOT, userId);
  const result = {
    user_id: userId,
    data_root: DATA_ROOT,
    ingested_at: new Date().toISOString(),
    profile: null,
    timeline: null,
    context: null,
    evidence: [],
    transcripts: [],
    indexes: {},
    missing: [],
  };

  // Profile
  const profileText = readFileIfExists(path.join(userRoot, 'profile.md'));
  if (profileText) {
    result.profile = readProfileMarkdown(profileText);
  } else {
    result.missing.push('profile.md');
  }

  // Timeline
  const timelineText = readFileIfExists(path.join(userRoot, 'timeline.md'));
  if (timelineText) {
    result.timeline = readTimelineMarkdown(timelineText);
  } else {
    result.missing.push('timeline.md');
  }

  // Context
  const contextText = readFileIfExists(path.join(userRoot, 'context.md'));
  if (contextText) {
    result.context = { raw: contextText };
  } else {
    result.missing.push('context.md');
  }

  // Evidence ledger
  const evidenceText = readFileIfExists(path.join(userRoot, 'evidence_ledger.csv'));
  if (evidenceText) {
    result.evidence = readEvidenceLedger(evidenceText);
  } else {
    result.missing.push('evidence_ledger.csv');
  }

  // Transcripts (calls)
  const callsDir = path.join(userRoot, 'transcripts', 'calls');
  if (fs.existsSync(callsDir)) {
    const files = fs.readdirSync(callsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    for (const file of files) {
      const text = readFileIfExists(path.join(callsDir, file));
      if (text) {
        result.transcripts.push({
          filename: file,
          type: 'call',
          ...readTranscriptMarkdown(text),
        });
      }
    }
  }

  // CSV indexes
  const indexDir = path.join(userRoot, 'indexes');
  const knownIndexes = [
    'inventory_manifest.csv',
    'export_manifest.csv',
    'master_interaction_ledger.csv',
    'call_history_normalized.csv',
    'recording_note_index.csv',
    'call_recording_matches.csv',
    'audio_transcript_index.csv',
    'google_calendar_import_interactions.csv',
    'google_calendar_events.csv',
  ];
  for (const filename of knownIndexes) {
    const text = readFileIfExists(path.join(indexDir, filename));
    if (text) {
      const key = filename.replace('.csv', '');
      if (filename === 'call_history_normalized.csv') {
        result.indexes[key] = readCallHistory(text);
      } else {
        result.indexes[key] = readCSV(text);
      }
    }
  }

  return result;
}

const summary = ingestUser(USER_ID);

console.log(JSON.stringify(summary, null, 2));

const evidenceCount = summary.evidence.length;
const transcriptCount = summary.transcripts.length;
const indexCount = Object.keys(summary.indexes).length;
const missingCount = summary.missing.length;

process.stderr.write(`
=== Ingest Summary ===
User:        ${USER_ID}
Data root:   ${DATA_ROOT}
Profile:     ${summary.profile ? 'OK' : 'MISSING'}
Timeline:    ${summary.timeline ? 'OK (' + (summary.timeline.events || []).length + ' events)' : 'MISSING'}
Context:     ${summary.context ? 'OK' : 'MISSING'}
Evidence:    ${evidenceCount} entries
Transcripts: ${transcriptCount} files
Indexes:     ${indexCount} files loaded
Missing:     ${missingCount > 0 ? summary.missing.join(', ') : 'none'}
======================
`);
