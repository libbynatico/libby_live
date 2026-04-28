function cleanTitle(text) {
  return String(text || '')
    .replace(/[^a-z0-9\s\-:]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function inferEventTitle({ transcript = '', tags = [], sourceType = '', fileName = '' }) {
  const text = String(transcript || '').toLowerCase();

  if (tags.includes('blood_pressure') || text.includes('blood pressure')) return 'Blood pressure and vitals capture';
  if (tags.includes('itching') || text.includes('itch')) return 'Itching / symptom event';
  if (tags.includes('phone_call') || sourceType === 'call_recording') return 'Phone call intake';
  if (tags.includes('sleep_wake') || text.includes('wake')) return 'Wake system / sleep event';
  if (tags.includes('appointment') || text.includes('appointment')) return 'Appointment or care-team event';
  if (tags.includes('pregnancy') || text.includes('pregnan') || text.includes('twins')) return 'Pregnancy-related update';
  if (fileName) return `File intake: ${cleanTitle(fileName)}`;
  return 'Libby captured event';
}

function inferSortBucket({ tags = [], sourceType = '' }) {
  if (tags.includes('symptom') || tags.includes('vitals') || tags.includes('pregnancy')) return 'medical';
  if (tags.includes('phone_call') || sourceType === 'call_recording') return 'calls';
  if (tags.includes('sleep_wake') || tags.includes('tbi_accommodation')) return 'systems';
  if (tags.includes('photo_evidence') || tags.includes('document_evidence')) return 'evidence';
  return 'general';
}

function inferPriority({ tags = [], riskFlags = [] }) {
  if (riskFlags.some(r => ['clinical_review', 'review'].includes(r.level))) return 'review';
  if (tags.includes('pregnancy') || tags.includes('vitals')) return 'watch';
  if (tags.includes('odsp') || tags.includes('appointment')) return 'action';
  return 'normal';
}

function inferPresentationMode({ tags = [], sourceType = '' }) {
  if (tags.includes('symptom') || tags.includes('vitals') || tags.includes('pregnancy')) return 'clinical';
  if (sourceType === 'call_recording' || tags.includes('correspondence')) return 'admin_call';
  if (tags.includes('photo_evidence') || tags.includes('document_evidence')) return 'evidence';
  return 'general';
}

module.exports = { inferEventTitle, inferSortBucket, inferPriority, inferPresentationMode };
