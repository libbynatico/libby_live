'use strict';

/**
 * Classifies evidence entries and timeline events into four buckets:
 *   confirmed      — high-confidence documented facts
 *   inferred       — reasonable conclusions from evidence
 *   open_questions — unresolved or unclear items
 *   action_required — things that need to happen
 */

const CONFIRMED_SIGNALS = ['confirmed', 'high', 'confirmed fact'];
const INFERRED_SIGNALS = ['medium', 'inferred', 'likely'];
const PENDING_SIGNALS = ['pending', 'low', 'unresolved', 'unknown'];

function classifyEvidence(entries) {
  const confirmed = [];
  const inferred = [];
  const open_questions = [];

  for (const e of entries) {
    const conf = (e.confidence || '').toLowerCase();
    if (CONFIRMED_SIGNALS.some(s => conf.includes(s))) {
      confirmed.push(e);
    } else if (INFERRED_SIGNALS.some(s => conf.includes(s))) {
      inferred.push(e);
    } else {
      open_questions.push(e);
    }
  }

  return { confirmed, inferred, open_questions };
}

function classifyTimelineEvents(events) {
  const confirmed = [];
  const inferred = [];
  const open_questions = [];
  const action_required = [];

  for (const e of events) {
    const status = (e.status || '').toLowerCase();
    if (status === 'action_required') {
      action_required.push(e);
    } else if (status === 'confirmed') {
      confirmed.push(e);
    } else if (status === 'inferred') {
      inferred.push(e);
    } else {
      open_questions.push(e);
    }
  }

  return { confirmed, inferred, open_questions, action_required };
}

/**
 * Formats a classified evidence set as a text block for a system prompt.
 */
function formatEvidenceBlock(classified) {
  const lines = [];

  if (classified.confirmed.length) {
    lines.push('## Confirmed Facts (documented evidence)');
    for (const e of classified.confirmed) {
      lines.push(`- [${e.date || 'undated'}] ${e.title}: ${e.establishes}`);
      if (e.notes) lines.push(`  Note: ${e.notes}`);
    }
  }

  if (classified.inferred.length) {
    lines.push('\n## Inferred / High-Confidence Notes');
    for (const e of classified.inferred) {
      lines.push(`- [${e.date || 'undated'}] ${e.title}: ${e.establishes}`);
    }
  }

  if (classified.open_questions.length) {
    lines.push('\n## Open Questions / Pending Evidence');
    for (const e of classified.open_questions) {
      lines.push(`- ${e.title}: ${e.establishes} (Status: ${e.confidence || 'unknown'})`);
    }
  }

  return lines.join('\n');
}

/**
 * Formats a classified timeline as a text block.
 */
function formatTimelineBlock(classified) {
  const lines = [];

  if (classified.confirmed.length) {
    lines.push('## Confirmed Timeline Events');
    for (const e of classified.confirmed.slice(0, 20)) {
      lines.push(`- ${e.date}: ${e.summary}`);
      if (e.details && e.details.length) {
        e.details.forEach(d => lines.push(`  • ${d}`));
      }
    }
  }

  if (classified.action_required.length) {
    lines.push('\n## Action Required');
    for (const e of classified.action_required) {
      lines.push(`- ${e.date ? e.date + ': ' : ''}${e.summary}`);
    }
  }

  if (classified.open_questions.length) {
    lines.push('\n## Unresolved Items');
    for (const e of classified.open_questions.slice(0, 10)) {
      lines.push(`- ${e.summary}`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  classifyEvidence,
  classifyTimelineEvents,
  formatEvidenceBlock,
  formatTimelineBlock,
};
