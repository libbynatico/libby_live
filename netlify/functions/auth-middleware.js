// Multi-patient data isolation guardrails
// Enforces read/write permissions and prevents cross-patient data leakage

const fs = require('fs');
const path = require('path');

const DATA_ROOT = process.env.DATA_ROOT || './data';

/**
 * Load and parse file metadata header
 * Metadata format:
 * ---
 * userID: mattherbert01
 * fileType: timeline | patient_truths | system_experiences | profile | custom
 * visibility: private | shared_with_[userID] | shared_with_[userID,userID]
 * owner: mattherbert01
 * lastModified: 2026-04-22
 * version: 1.0
 * ---
 */
function readMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!metadataMatch) {
    return {
      userID: 'unknown',
      fileType: 'unknown',
      visibility: 'private',
      owner: 'unknown',
      lastModified: new Date().toISOString(),
      version: '1.0'
    };
  }

  const metadata = {};
  const lines = metadataMatch[1].split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  }

  return metadata;
}

/**
 * Check if currentUser can read targetUserID's data
 */
function canRead(targetUserID, currentUser) {
  if (targetUserID === currentUser) {
    return { allowed: true, reason: 'own_data' };
  }

  // Check shared reference
  if (targetUserID === '_shared') {
    return { allowed: true, reason: 'shared_reference' };
  }

  // Check if explicitly shared
  const filePath = path.join(DATA_ROOT, targetUserID, 'timeline.md');
  if (fs.existsSync(filePath)) {
    const metadata = readMetadata(filePath);
    if (metadata.visibility && metadata.visibility.includes(`shared_with_${currentUser}`)) {
      return { allowed: true, reason: 'shared_with_current_user' };
    }
  }

  return { allowed: false, reason: 'access_denied' };
}

/**
 * Check if currentUser can write to targetUserID's data
 */
function canWrite(targetUserID, currentUser, filePath) {
  // Only owner can write
  if (targetUserID !== currentUser) {
    // Exception: shared docs can be updated by any authorized user
    if (targetUserID === '_shared') {
      const metadata = readMetadata(filePath);
      if (metadata.visibility && metadata.visibility.includes(`shared_with_${currentUser}`)) {
        return { allowed: true, reason: 'shared_doc_editor' };
      }
    }
    return { allowed: false, reason: 'only_owner_can_write' };
  }

  return { allowed: true, reason: 'owner' };
}

/**
 * Load patient data with permission check
 */
async function loadPatientData(userID, currentUser, dataType = 'timeline') {
  try {
    const permission = canRead(userID, currentUser);
    if (!permission.allowed) {
      logAccess({
        timestamp: new Date().toISOString(),
        userID,
        filePath: `data/${userID}/${dataType}.md`,
        action: 'read',
        currentUser,
        status: 'denied',
        reason: permission.reason
      });

      throw new Error(
        `Access denied: ${userID}'s data not accessible (${permission.reason})`
      );
    }

    const filePath = path.join(DATA_ROOT, userID, `${dataType}.md`);

    if (!fs.existsSync(filePath)) {
      logAccess({
        timestamp: new Date().toISOString(),
        userID,
        filePath: `data/${userID}/${dataType}.md`,
        action: 'read',
        currentUser,
        status: 'not_found'
      });

      throw new Error(`File not found: ${userID}/${dataType}.md`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = readMetadata(filePath);

    logAccess({
      timestamp: new Date().toISOString(),
      userID,
      filePath: `data/${userID}/${dataType}.md`,
      action: 'read',
      currentUser,
      status: 'allowed',
      reason: permission.reason
    });

    return {
      userID,
      fileType: metadata.fileType,
      visibility: metadata.visibility,
      owner: metadata.owner,
      content,
      metadata
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Update patient data with permission check
 */
async function updatePatientData(userID, currentUser, dataType, newContent) {
  try {
    const filePath = path.join(DATA_ROOT, userID, `${dataType}.md`);
    const permission = canWrite(userID, currentUser, filePath);

    if (!permission.allowed) {
      logAccess({
        timestamp: new Date().toISOString(),
        userID,
        filePath: `data/${userID}/${dataType}.md`,
        action: 'write',
        currentUser,
        status: 'denied',
        reason: permission.reason
      });

      throw new Error(`Write access denied: ${permission.reason}`);
    }

    // Update metadata lastModified
    const metadata = readMetadata(filePath);
    metadata.lastModified = new Date().toISOString().split('T')[0];

    const metadataStr = Object.entries(metadata)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const contentWithMetadata = `---\n${metadataStr}\n---\n${newContent}`;
    fs.writeFileSync(filePath, contentWithMetadata);

    logAccess({
      timestamp: new Date().toISOString(),
      userID,
      filePath: `data/${userID}/${dataType}.md`,
      action: 'write',
      currentUser,
      status: 'allowed',
      reason: permission.reason,
      modifiedBy: currentUser
    });

    return { success: true, filePath };
  } catch (error) {
    throw error;
  }
}

/**
 * Propose shared data update (notifies all viewers)
 */
async function promptSharedDataUpdate(sharedFilePath, currentUser, change) {
  try {
    const metadata = readMetadata(sharedFilePath);
    const visibility = metadata.visibility || '';

    if (!visibility.includes(`shared_with_${currentUser}`)) {
      throw new Error("You don't have access to this shared file");
    }

    const proposal = {
      proposedBy: currentUser,
      change,
      timestamp: new Date().toISOString(),
      status: 'pending_approval'
    };

    logAccess({
      timestamp: new Date().toISOString(),
      userID: '_shared',
      filePath: sharedFilePath,
      action: 'propose_update',
      currentUser,
      status: 'proposal_created',
      proposalID: proposal.timestamp
    });

    // In production, send notifications to all viewers in visibility
    // For now, log the proposal

    return {
      success: true,
      proposal,
      viewers: visibility.split(',').map(v => v.replace('shared_with_', ''))
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Check cross-patient access (security test)
 */
async function testCrossPatientAccess(sourceUser, targetUser, currentUser) {
  const permission = canRead(targetUser, currentUser);
  return {
    sourceUser,
    targetUser,
    currentUser,
    canAccess: permission.allowed,
    reason: permission.reason
  };
}

/**
 * Log all access attempts for audit
 */
function logAccess(record) {
  const auditDir = path.join(DATA_ROOT, '_system');
  const auditPath = path.join(auditDir, 'file_access_log.json');

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  let logs = [];
  if (fs.existsSync(auditPath)) {
    const content = fs.readFileSync(auditPath, 'utf8');
    if (content) logs = JSON.parse(content);
  }

  logs.push(record);

  // Keep last 10000 entries (prevent unbounded growth)
  if (logs.length > 10000) {
    logs = logs.slice(-10000);
  }

  fs.writeFileSync(auditPath, JSON.stringify(logs, null, 2));
}

/**
 * Netlify handler for permission-checked data operations
 */
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { operation, userID, currentUser, dataType, content } = JSON.parse(
      event.body
    );

    if (!operation || !userID || !currentUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing operation, userID, or currentUser'
        })
      };
    }

    let result;

    switch (operation) {
      case 'read':
        result = await loadPatientData(userID, currentUser, dataType || 'timeline');
        break;
      case 'write':
        if (!content) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing content for write operation' })
          };
        }
        result = await updatePatientData(
          userID,
          currentUser,
          dataType || 'timeline',
          content
        );
        break;
      case 'test_cross_patient':
        result = await testCrossPatientAccess(userID, dataType, currentUser);
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown operation: ${operation}` })
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Export for use in other functions
module.exports = {
  loadPatientData,
  updatePatientData,
  promptSharedDataUpdate,
  testCrossPatientAccess,
  logAccess,
  readMetadata,
  canRead,
  canWrite
};
