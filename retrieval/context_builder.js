'use strict';

const fs = require('fs');
const path = require('path');
const { readEvidenceLedger, readCallHistory, readCSV } = require('../importers/csv_reader');
const { readProfileMarkdown, readTimelineMarkdown, readTranscriptMarkdown } = require('../importers/markdown_reader');
const { classifyEvidence, classifyTimelineEvents, formatEvidenceBlock, formatTimelineBlock } = require('./fact_classifier');

/**
 * Loads all normalized artifacts for a given user from DATA_ROOT.
 * Returns null if user directory does not exist.
 */
function loadUserKnowledge(userId, dataRoot) {
  const userRoot = path.join(dataRoot, userId);

  if (!fs.existsSync(userRoot)) {
    return null;
  }

  const read = rel => {
    try { return fs.readFileSync(path.join(userRoot, rel), 'utf8'); }
    catch { return null; }
  };

  const profileText = read('profile.md');
  const timelineText = read('timeline.md');
  const contextText = read('context.md');
  const evidenceText = read('evidence_ledger.csv');

  const profile = profileText ? readProfileMarkdown(profileText) : null;
  const timeline = timelineText ? readTimelineMarkdown(timelineText) : null;
  const context = contextText || null;
  const evidence = evidenceText ? readEvidenceLedger(evidenceText) : [];

  // Load call transcripts
  const transcripts = [];
  const callsDir = path.join(userRoot, 'transcripts', 'calls');
  if (fs.existsSync(callsDir)) {
    const files = fs.readdirSync(callsDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    for (const file of files.slice(0, 10)) {
      const text = read(path.join('transcripts', 'calls', file));
      if (text) {
        transcripts.push({ filename: file, ...readTranscriptMarkdown(text) });
      }
    }
  }

  // Load master interaction ledger if present
  const ledgerText = read(path.join('indexes', 'master_interaction_ledger.csv'));
  const interactions = ledgerText ? readCSV(ledgerText).slice(0, 30) : [];

  return { profile, timeline, context, evidence, transcripts, interactions };
}

/**
 * Builds the system prompt context block for a given user.
 * This is injected into every chat call.
 *
 * audience: general | worker | legal | medical
 */
function buildSystemContext(userId, dataRoot, audience) {
  const knowledge = loadUserKnowledge(userId, dataRoot);

  if (!knowledge) {
    return `No structured case knowledge found for user ${userId}. Responding in general mode.`;
  }

  const parts = [];

  // Who this is
  if (knowledge.profile) {
    const p = knowledge.profile;
    parts.push(`## Patient Profile: ${p.title || userId}`);
    if (p.current_situation) parts.push(`Current situation:\n${p.current_situation}`);
    if (p.diagnoses) parts.push(`Diagnoses:\n${p.diagnoses}`);
    if (p.daily_realities) parts.push(`Day-to-day realities:\n${p.daily_realities}`);
    if (p.reusable_truths) parts.push(`Established truths:\n${p.reusable_truths}`);
    if (audience === 'worker' || audience === 'legal') {
      if (p.contacts) parts.push(`Key contacts:\n${p.contacts}`);
    }
  }

  // Additional context file
  if (knowledge.context) {
    parts.push(`## Case Context\n${knowledge.context.slice(0, 1500)}`);
  }

  // Evidence
  if (knowledge.evidence.length) {
    const classified = classifyEvidence(knowledge.evidence);
    const block = formatEvidenceBlock(classified);
    if (block) parts.push(`## Evidence\n${block}`);
  }

  // Timeline
  if (knowledge.timeline && knowledge.timeline.events && knowledge.timeline.events.length) {
    const classified = classifyTimelineEvents(knowledge.timeline.events);
    const block = formatTimelineBlock(classified);
    if (block) parts.push(`## Case Timeline\n${block}`);
  }

  // Recent interactions (high signal for chat context)
  if (knowledge.interactions.length) {
    parts.push(`## Recent Interactions (from master ledger)\n` +
      knowledge.interactions.slice(0, 10).map(r => {
        const row = Object.values(r).filter(Boolean).join(' | ');
        return `- ${row}`;
      }).join('\n')
    );
  }

  // Transcripts (just summaries, not full text)
  if (knowledge.transcripts.length) {
    parts.push(`## Call Transcripts (${knowledge.transcripts.length} available)`);
    knowledge.transcripts.slice(0, 5).forEach(t => {
      parts.push(`- ${t.filename}: ${t.summary || t.title || 'no summary'}`);
    });
  }

  return parts.join('\n\n');
}

module.exports = { loadUserKnowledge, buildSystemContext };
