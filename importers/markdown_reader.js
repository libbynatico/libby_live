'use strict';

/**
 * Extracts top-level H1 heading from markdown text.
 */
function extractTitle(md) {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

/**
 * Splits markdown into named sections (## headings).
 * Returns { sectionName: content, ... }
 */
function extractSections(md) {
  const sections = {};
  const parts = md.split(/^##\s+/m);

  // parts[0] is the preamble before first ##
  if (parts[0].trim()) {
    sections['_preamble'] = parts[0].trim();
  }

  for (let i = 1; i < parts.length; i++) {
    const newline = parts[i].indexOf('\n');
    const heading = newline === -1 ? parts[i].trim() : parts[i].slice(0, newline).trim();
    const body = newline === -1 ? '' : parts[i].slice(newline + 1).trim();
    sections[heading] = body;
  }

  return sections;
}

/**
 * Reads a patient profile markdown file into a structured object.
 * Looks for known section headings.
 */
function readProfileMarkdown(text) {
  const sections = extractSections(text);
  return {
    title: extractTitle(text),
    current_situation: sections['Current Situation'] || sections['Current situation'] || '',
    diagnoses: sections['Confirmed Diagnoses'] || sections['Diagnoses'] || sections['Confirmed diagnoses / conditions'] || '',
    daily_realities: sections['Patient Realities'] || sections['Daily Realities'] || sections['Day-to-day realities'] || '',
    reusable_truths: sections['Patient Truths'] || sections['Reusable Truths'] || sections['Reusable truth statements'] || '',
    contacts: sections['Contacts'] || sections['System Contacts'] || '',
    next_steps: sections['Next Steps'] || sections['Immediate Next Steps'] || sections['Next steps'] || '',
    outstanding: sections['Outstanding Issues'] || sections['Outstanding'] || '',
    raw: text,
  };
}

/**
 * Reads a timeline markdown file into structured events.
 * Expects ### Date: heading or bold date lines.
 */
function readTimelineMarkdown(text) {
  const sections = extractSections(text);
  const events = [];

  // Parse bullet-list events under year sections
  for (const [heading, body] of Object.entries(sections)) {
    if (/^\d{4}$/.test(heading.trim())) {
      const year = heading.trim();
      const lines = body.split('\n');
      let currentEvent = null;

      for (const line of lines) {
        const dateMatch = line.match(/^\s*[-*]\s+\*\*(.+?)\*\*[:\s]*(.*)/);
        const bulletMatch = line.match(/^\s{2,}[-*]\s+(.*)/);

        if (dateMatch) {
          if (currentEvent) events.push(currentEvent);
          currentEvent = {
            date: dateMatch[1].trim().includes(year) ? dateMatch[1].trim() : `${year}-${dateMatch[1].trim()}`,
            summary: dateMatch[2].trim(),
            details: [],
            status: 'confirmed',
          };
        } else if (bulletMatch && currentEvent) {
          currentEvent.details.push(bulletMatch[1].trim());
        }
      }
      if (currentEvent) events.push(currentEvent);
    }
  }

  return {
    title: extractTitle(text),
    events,
    sections,
    raw: text,
  };
}

/**
 * Reads a call transcript markdown file.
 */
function readTranscriptMarkdown(text) {
  const sections = extractSections(text);
  return {
    title: extractTitle(text),
    date: sections['Date'] || sections['Call Date'] || '',
    participants: sections['Participants'] || '',
    summary: sections['Summary'] || sections['Call Summary'] || '',
    key_points: sections['Key Points'] || sections['Key points'] || '',
    action_items: sections['Action Items'] || sections['Next steps'] || '',
    raw: text,
  };
}

module.exports = {
  extractTitle,
  extractSections,
  readProfileMarkdown,
  readTimelineMarkdown,
  readTranscriptMarkdown,
};
