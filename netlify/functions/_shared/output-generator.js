function sentenceTrim(text, max = 260) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  return clean.length > max ? clean.slice(0, max - 1).trim() + '…' : clean;
}

function bullets(items) {
  return (items || []).filter(Boolean).map(item => `- ${item}`).join('\n');
}

function extractActionHints(rawInput = '') {
  const text = String(rawInput || '');
  const hints = [];
  const lower = text.toLowerCase();

  if (lower.includes('appointment') || lower.includes('mcmaster') || lower.includes('sinai') || lower.includes('clinic')) {
    hints.push('Prepare appointment-facing summary and questions.');
  }
  if (lower.includes('odsp') || lower.includes('worker') || lower.includes('deadline') || lower.includes('due')) {
    hints.push('Extract deadlines, promised actions, and responsible person/office.');
  }
  if (lower.includes('itch') || lower.includes('rash') || lower.includes('blood pressure') || lower.includes('headache')) {
    hints.push('Preserve symptom details for care-team review without diagnosing.');
  }
  if (lower.includes('wake') || lower.includes('alarm') || lower.includes('sleep')) {
    hints.push('Track operational failure and reduce reliance on human escalation.');
  }

  if (!hints.length) hints.push('Review, classify, and decide whether this needs follow-up.');
  return hints;
}

function generateOutputs(eventRecord) {
  const c = eventRecord.classification || {};
  const tags = c.tags || [];
  const routes = c.agent_routes || [];
  const risks = c.risk_flags || [];
  const raw = eventRecord.raw_input || '';

  const summary = sentenceTrim(raw, 420) || `${eventRecord.source_type || 'Manual'} intake captured under ${eventRecord.trigger}.`;

  const nextSteps = extractActionHints(raw);

  const clinicalSummary = (tags.includes('symptom') || tags.includes('vitals') || tags.includes('pregnancy'))
    ? [
        '# Clinical Review Draft',
        '',
        '## Summary',
        summary,
        '',
        '## Source Labels',
        bullets([
          'Raw text is user-supplied and should be treated as patient/support-person report unless verified.',
          'No diagnosis is inferred from this record.',
          'Escalation decisions remain with the care team or triage instructions.'
        ]),
        '',
        '## Risk / Review Flags',
        bullets(risks.map(r => `${r.label}: ${r.note}`)) || '- No automatic risk flag generated.',
        '',
        '## Questions for clinician',
        bullets([
          'Does this symptom pattern change the current care plan?',
          'What specific thresholds should trigger triage or urgent assessment?',
          'What should be tracked at home, and how often?'
        ])
      ].join('\n')
    : null;

  const familyUpdate = [
    '# Family Update Draft',
    '',
    summary,
    '',
    '## What matters',
    bullets([
      `Captured as ${eventRecord.trigger}.`,
      `Source type: ${eventRecord.source_type}.`,
      tags.length ? `Tagged: ${tags.join(', ')}.` : 'No tags assigned yet.'
    ]),
    '',
    '## Next steps',
    bullets(nextSteps)
  ].join('\n');

  const boardUpdate = [
    '# Board / Meeting Update Draft',
    '',
    '## Event',
    bullets([
      `Event ID: ${eventRecord.event_id}`,
      `Date: ${eventRecord.local_date}`,
      `Trigger: ${eventRecord.trigger}`,
      `Source: ${eventRecord.source_type}`
    ]),
    '',
    '## Summary',
    summary,
    '',
    '## Agent routing',
    bullets(routes.map(r => `${r.domain} — ${r.purpose}`)),
    '',
    '## Action queue',
    bullets(nextSteps)
  ].join('\n');

  return {
    summary,
    next_steps: nextSteps,
    clinical_summary_md: clinicalSummary,
    family_update_md: familyUpdate,
    board_update_md: boardUpdate
  };
}

module.exports = { generateOutputs };
