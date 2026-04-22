'use strict';

const fs = require('fs');
const path = require('path');
const { readEvidenceLedger, readCallHistory, readCSV } = require('../importers/csv_reader');
const { readProfileMarkdown, readTimelineMarkdown, readTranscriptMarkdown } = require('../importers/markdown_reader');
const { classifyEvidence, classifyTimelineEvents, formatEvidenceBlock, formatTimelineBlock } = require('./fact_classifier');

/**
 * Loads all normalized artifacts for a given user from DATA_ROOT, including ledgers.
 * Returns null if user directory does not exist.
 * Agent-aware: loads data that feeds the 100-agent system.
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

  // Load the 4 primary ledgers that feed the agent system
  const correspondenceText = read(path.join('ledgers', 'correspondence.csv'));
  const contactsText = read(path.join('ledgers', 'contacts_master.csv'));
  const appointmentsText = read(path.join('ledgers', 'appointments_transportation.csv'));

  const correspondence = correspondenceText ? readCSV(correspondenceText) : [];
  const contacts = contactsText ? readCSV(contactsText) : [];
  const appointments = appointmentsText ? readCSV(appointmentsText) : [];

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

  return { profile, timeline, context, evidence, transcripts, interactions, correspondence, contacts, appointments };
}

/**
 * Builds the system prompt context block for a given user.
 * This is injected into every chat call.
 * Agent-aware: prioritizes facts by agent responsibility and confidence level.
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

  // Additional context file (Patient Realities Ledger)
  if (knowledge.context) {
    parts.push(`## Case Context (Functional Barriers & System Effects)\n${knowledge.context.slice(0, 1500)}`);
  }

  // Evidence with confidence labels (Evidence Library)
  if (knowledge.evidence.length) {
    const classified = classifyEvidence(knowledge.evidence);
    const block = formatEvidenceBlock(classified);
    if (block) parts.push(`## Evidence Library (Confidence-Tagged)\n${block}`);
  }

  // Timeline (Life Events)
  if (knowledge.timeline && knowledge.timeline.events && knowledge.timeline.events.length) {
    const classified = classifyTimelineEvents(knowledge.timeline.events);
    const block = formatTimelineBlock(classified);
    if (block) parts.push(`## Life Events Timeline\n${block}`);
  }

  // Correspondence Ledger (feeds agents 32, 89-94)
  if (knowledge.correspondence && knowledge.correspondence.length) {
    parts.push(`## Communication History (Last 10 communications)\n` +
      knowledge.correspondence.slice(0, 10).map(r => {
        const category = r.category || 'unknown';
        const dir = (r.direction || 'internal').toUpperCase();
        const subj = r.subject || 'no subject';
        return `- [${r.date}] ${dir} to ${r.person_org} (${category}): ${subj}`;
      }).join('\n') +
      `\n*Full correspondence ledger available; see Agent 32 (Email Drafter) for context.*`
    );
  }

  // Contacts Master (feeds all 5 Core Coordinator Agents)
  if (knowledge.contacts && knowledge.contacts.length) {
    const byType = {};
    knowledge.contacts.forEach(c => {
      const type = c.contact_type || 'other';
      if (!byType[type]) byType[type] = [];
      byType[type].push(c);
    });

    parts.push(`## Key Contacts Registry (by type)\n` +
      Object.entries(byType).map(([type, list]) => {
        return `**${type.replace(/_/g, ' ')}** (${list.length}):\n` +
          list.slice(0, 5).map(c =>
            `- ${c.name} (${c.organization}): ${c.email_primary || c.phone_primary || 'contact info pending'}`
          ).join('\n');
      }).join('\n\n')
    );
  }

  // Appointments & Transportation (feeds agents 55, 69, 89)
  if (knowledge.appointments && knowledge.appointments.length) {
    const upcoming = knowledge.appointments
      .filter(a => new Date(a.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    if (upcoming.length > 0) {
      parts.push(`## Upcoming Appointments (with Transportation)\n` +
        upcoming.map(a => {
          const transport = a.transport_mode || 'TBD';
          const city = a.city ? ` [${a.city}]` : '';
          return `- ${a.date}: ${a.appointment_type} with ${a.provider_name}${city}\n  Transport: ${transport} (~${a.estimated_distance_km || '?'} km)`;
        }).join('\n')
      );
    }
  }

  // Agent Responsibility Map (helps chatbot know which agent owns which domain)
  parts.push(`## Agent Responsibility Map (Life Librarian System)\n` +
    `**Surgical/GI Coordination**: Crohn's disease, ileostomy, surgeries, specialist follow-up (Agents 7-9)\n` +
    `**Disability/Income Systems**: ODSP, Ontario Works, DSO, benefits claims (Agents 10-12)\n` +
    `**Functional/Rehabilitation**: TBI, accommodations, physiatry, pain management (Agents 13-15)\n` +
    `**Administrative Oversight**: Legal disputes, ombudsman escalations, litigation (Agents 16-18)\n` +
    `**Housing & Community Stability**: Housing applications, community resources (Agents 19-21)\n` +
    `When responding, note which agent's domain applies to this question.`
  );

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
