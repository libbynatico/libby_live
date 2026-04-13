// drive-gmail-connector.js

// OAuth token management
let oauthToken = null;

function setOAuthToken(token) {
    oauthToken = token;
}

function getOAuthToken() {
    return oauthToken;
}

// Query builder for Google Drive file search
function buildDriveQuery(queryParams) {
    const { name, mimeType, folderId } = queryParams;
    let query = 'trashed = false';
    if (name) {
        query += ` and name contains '${name}'`;
    }
    if (mimeType) {
        query += ` and mimeType='${mimeType}'`;
    }
    if (folderId) {
        query += ` and '${folderId}' in parents`;
    }
    return query;
}

// Query builder for Gmail message search
function buildGmailQuery(queryParams) {
    const { from, subject, hasAttachment } = queryParams;
    let query = '';
    if (from) {
        query += `from:${from} `;
    }
    if (subject) {
        query += `subject:${subject} `;
    }
    if (hasAttachment) {
        query += 'has:attachment';
    }
    return query.trim();
}

// Response formatter for Drive search results
function formatDriveResponse(results) {
    return results.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink
    }));
}

// Response formatter for Gmail search results
function formatGmailResponse(results) {
    return results.map(message => ({
        id: message.id,
        snippet: message.snippet,
        threadId: message.threadId
    }));
}

// Example sendChat function that uses the query handlers
async function sendChat(driveQueryParams, gmailQueryParams) {
    const driveQuery = buildDriveQuery(driveQueryParams);
    const gmailQuery = buildGmailQuery(gmailQueryParams);
    
    // Perform Google Drive search (pseudo code)
    const driveResults = await searchDrive(driveQuery);
    const formattedDriveResults = formatDriveResponse(driveResults);
    
    // Perform Gmail search (pseudo code)
    const gmailResults = await searchGmail(gmailQuery);
    const formattedGmailResults = formatGmailResponse(gmailResults);
    
    return {
        driveResults: formattedDriveResults,
        gmailResults: formattedGmailResults
    };
}

module.exports = {
    setOAuthToken,
    getOAuthToken,
    buildDriveQuery,
    buildGmailQuery,
    formatDriveResponse,
    formatGmailResponse,
    sendChat
};