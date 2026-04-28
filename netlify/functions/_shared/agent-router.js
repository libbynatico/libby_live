function lower(value) {
  return String(value || '').toLowerCase();
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function detectTags({ trigger, sourceType, rawInput, fileName }) {
  const text = lower([trigger, sourceType, rawInput, fileName].join(' '));
  const tags = [];

  if (text.includes('itch') || text.includes('scratch') || text.includes('rash')) tags.push('itching', 'symptom');
  if (text.includes('blood pressure') || text.includes('bp') || text.includes('systolic') || text.includes('diastolic')) tags.push('blood_pressure', 'vitals');
  if (text.includes('sleep') || text.includes('wake') || text.includes('alarm')) tags.push('sleep_wake', 'tbi_accommodation');
  if (text.includes('call') || sourceType === 'call_recording') tags.push('phone_call', 'correspondence');
  if (text.includes('odsp') || text.includes('ontario works') || text.includes('worker')) tags.push('benefits', 'odsp');
  if (text.includes('appointment') || text.includes('clinic') || text.includes('mcmaster') || text.includes('sinai')) tags.push('appointment', 'medical_admin');
  if (text.includes('pregnan') || text.includes('baby') || text.includes('twins')) tags.push('pregnancy');
  if (sourceType === 'photo' || /\.(png|jpg|jpeg|webp|heic)$/i.test(fileName || '')) tags.push('photo_evidence');
  if (sourceType === 'document' || /\.(pdf|docx|txt|md)$/i.test(fileName || '')) tags.push('document_evidence');
  if (sourceType === 'voice_memo' || sourceType === 'notes_audio') tags.push('audio_capture');

  return uniq(tags);
}

function routeAgents({ trigger, sourceType, tags }) {
  const routes = [];
  const t = trigger || '';

  if (['/symptom_log', '/patient_event_update', '/clinical_summary', '/bp_log'].includes(t) || tags.includes('symptom') || tags.includes('vitals') || tags.includes('pregnancy')) {
    routes.push({ domain: 'Medical / Clinical Review', owner: 'Surgical/GI + Pregnancy Care Coordination', purpose: 'Extract symptoms, vitals, risk flags, clinician questions.' });
  }

  if (['/wake_system'].includes(t) || tags.includes('sleep_wake') || tags.includes('tbi_accommodation')) {
    routes.push({ domain: 'Functional / Rehab / Accommodation', owner: 'Functional/Rehabilitation Coordination', purpose: 'Track wake failures, TBI accommodations, appointment-readiness systems.' });
  }

  if (['/call_record', '/call_summary'].includes(t) || sourceType === 'call_recording' || tags.includes('correspondence')) {
    routes.push({ domain: 'Correspondence / Admin', owner: 'Disability/Income + Administrative Oversight', purpose: 'Extract promises, deadlines, contradictions, and follow-ups from calls.' });
  }

  if (tags.includes('photo_evidence') || tags.includes('document_evidence')) {
    routes.push({ domain: 'Evidence Library', owner: 'Evidence + Missing Evidence Review', purpose: 'Create evidence ledger rows and preserve raw source references.' });
  }

  if (['/board_update', '/appointment_prep', '/presentation_packet'].includes(t)) {
    routes.push({ domain: 'Presentation / Meeting Mode', owner: 'Executive Briefing Coordination', purpose: 'Generate display-ready briefs using confirmed facts only.' });
  }

  if (!routes.length) {
    routes.push({ domain: 'General Intake', owner: 'Life Librarian Intake', purpose: 'Preserve raw input, classify later, and surface next actions.' });
  }

  return routes;
}

function recommendOutputs({ trigger, tags, sourceType }) {
  const outputs = ['raw_appendix', 'event_json'];

  if (tags.includes('symptom') || tags.includes('vitals') || tags.includes('pregnancy')) outputs.push('clinical_summary', 'questions_for_clinician');
  if (tags.includes('correspondence') || sourceType === 'call_recording') outputs.push('call_summary', 'follow_up_tasks', 'correspondence_ledger_row');
  if (tags.includes('sleep_wake') || tags.includes('tbi_accommodation')) outputs.push('wake_system_summary', 'accommodation_actions');
  if (tags.includes('photo_evidence') || tags.includes('document_evidence')) outputs.push('evidence_ledger_row');
  if (trigger === '/board_update' || trigger === '/appointment_prep') outputs.push('board_brief', 'meeting_agenda');
  if (!outputs.includes('next_steps')) outputs.push('next_steps');

  return uniq(outputs);
}

function riskFlags({ rawInput, tags }) {
  const text = lower(rawInput);
  const flags = [];

  if (tags.includes('pregnancy') && (text.includes('headache') || text.includes('vision') || text.includes('spots') || text.includes('blood pressure'))) {
    flags.push({ level: 'review', label: 'Pregnancy symptom/vitals review', note: 'Preserve for clinician review; do not interpret as diagnosis.' });
  }
  if (text.includes('can\'t sleep') || text.includes('cannot sleep') || text.includes('not sleeping')) {
    flags.push({ level: 'functional', label: 'Sleep disruption', note: 'Track severity, duration, and downstream appointment impact.' });
  }
  if (text.includes('skin broken') || text.includes('bleeding') || text.includes('discharge') || text.includes('scab')) {
    flags.push({ level: 'clinical_review', label: 'Skin integrity concern', note: 'Record as observed/reported and raise with care team if worsening.' });
  }
  return flags;
}

function classifyIntake(input) {
  const tags = detectTags(input);
  const agent_routes = routeAgents({ ...input, tags });
  const outputs_requested = recommendOutputs({ ...input, tags });
  const risk_flags = riskFlags({ ...input, tags });

  return {
    tags,
    agent_routes,
    outputs_requested,
    risk_flags,
    source_confidence: input.rawInput ? 'raw_transcript_or_user_supplied' : 'metadata_only'
  };
}

module.exports = { classifyIntake };
