function norm(value) {
  return String(value || '').toLowerCase();
}

const PROJECT_MAP = [
  {
    project: 'Pregnancy / McMaster / Birth Prep',
    category: 'clinical_birth_prep',
    keywords: ['pregnan', 'mcmaster', 'sinai', 'labour', 'labor', 'triage', 'blood pressure', 'itch', 'rash', 'headache', 'baby', 'twins', 'car seat', 'safe sleep', 'hospital bag'],
    why: 'May affect pregnancy care, hospital readiness, triage questions, or birth-prep tasks.'
  },
  {
    project: 'Home / Condo / Lease / Landlord',
    category: 'housing_condo',
    keywords: ['lease', 'landlord', 'tenant', 'condo', 'unit', 'jamieson', 'wall', 'carpet', 'smoke', 'maintenance', 'utilities', 'insurance', 'pet'],
    why: 'May affect lease obligations, environmental concerns, landlord notices, or household setup.'
  },
  {
    project: 'ODSP / Ontario Works / Benefits',
    category: 'benefits_admin',
    keywords: ['odsp', 'ontario works', 'worker', 'caseworker', 'benefit', 'review', 'income', 'transportation', 'receipt', 'taxi'],
    why: 'May affect benefits evidence, review packages, transportation claims, or worker follow-up.'
  },
  {
    project: 'Functional Rehab / TBI / Accessibility',
    category: 'functional_accessibility',
    keywords: ['wake', 'alarm', 'sleep', 'tbi', 'head injury', 'walker', 'pain', 'appointment', 'communication', 'non-verbal', 'ipad', 'speech'],
    why: 'May support accommodation planning, accessibility workflows, and appointment-readiness systems.'
  },
  {
    project: 'Baby Inventory / Shower / Thank-you Tracker',
    category: 'baby_inventory',
    keywords: ['baby shower', 'gift', 'inventory', 'thank you', 'basket', 'bassinet', 'diaper', 'sleeper', 'clothes', 'bottle'],
    why: 'May belong in baby-item inventory, donor tracking, thank-you notes, or prep checklists.'
  },
  {
    project: 'Rogers / Telecom / Device Admin',
    category: 'telecom_admin',
    keywords: ['rogers', 'fido', 'iphone', 'bill', 'promo', 'device', 'sim', 'internet'],
    why: 'May affect telecom escalation, billing evidence, or account follow-up.'
  },
  {
    project: 'Medical History / Patient Zero',
    category: 'patient_zero_medical',
    keywords: ['crohn', 'ostomy', 'ileostomy', 'hospital', 'surgery', 'medication', 'prednisone', 'reactin', 'benadryl', 'pain'],
    why: 'May belong in Patient Zero clinical chronology or current-care evidence.'
  }
];

function discoverRelevance(eventRecord) {
  const text = norm([
    eventRecord.trigger,
    eventRecord.source_type,
    eventRecord.raw_input,
    eventRecord.transcript_text,
    eventRecord.file_name,
    JSON.stringify(eventRecord.classification || {})
  ].join(' '));

  const links = [];
  const emerging = [];

  for (const item of PROJECT_MAP) {
    const hits = item.keywords.filter(k => text.includes(k));
    if (hits.length) {
      links.push({
        project: item.project,
        category: item.category,
        matched_terms: hits,
        relevance_reason: item.why,
        confidence: hits.length >= 3 ? 'high' : hits.length === 2 ? 'medium' : 'low'
      });
    }
  }

  const knownCategories = new Set(PROJECT_MAP.map(p => p.category));
  const classificationTags = eventRecord.classification?.tags || [];
  for (const tag of classificationTags) {
    if (!knownCategories.has(tag) && !PROJECT_MAP.some(p => p.keywords.includes(tag))) {
      emerging.push({
        proposed_category: tag,
        reason: 'Tag detected by classifier but not yet mapped to a project category.',
        action: 'Review whether this should become a durable category or route.'
      });
    }
  }

  const recommendations = [];
  if (links.length > 1) {
    recommendations.push('Cross-link this event across multiple project lanes rather than storing it in only one timeline.');
  }
  if (emerging.length) {
    recommendations.push('Review emerging categories and decide whether to add them to PROJECT_MAP.');
  }
  if (!links.length) {
    recommendations.push('No known project match found. Store as general intake and review manually.');
  }

  return {
    project_links: links,
    emerging_categories: emerging,
    recommendations
  };
}

module.exports = { discoverRelevance, PROJECT_MAP };
