// Gmail + Drive auto-sync for Libby Live
// Uses raw fetch to Google REST APIs — no npm dependencies required.
//
// OAuth token flow:
//   ?action=auth     → returns { authUrl } for the user to open
//   ?action=callback → exchanges code for tokens, returns { access_token, refresh_token }
//                      the frontend stores these in localStorage
//   ?action=sync     → expects access_token in Authorization: Bearer header or body.accessToken

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
].join(' ');

function getRedirectUri() {
  const base = process.env.SITE_URL || 'https://libbynatico.github.io/libby_live';
  return `${base}/.netlify/functions/gmail-drive-sync`;
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

// Step 1: Build Google OAuth consent URL and return it to the client.
function buildAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: 'callback',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Step 2: Exchange auth code for tokens via Google's token endpoint.
async function exchangeCode(code) {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token exchange failed (${resp.status}): ${err}`);
  }
  return resp.json();
}

// Refresh an expired access token using the stored refresh token.
async function refreshAccessToken(refreshToken) {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token refresh failed (${resp.status}): ${err}`);
  }
  return resp.json();
}

// Step 3: Extract meetings from Gmail using the REST API.
async function extractMeetings(accessToken) {
  const listResp = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(ODSP OR meeting OR appointment OR review)&maxResults=10',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!listResp.ok) throw new Error(`Gmail list failed: ${listResp.status}`);
  const listData = await listResp.json();

  const meetings = [];
  for (const msg of (listData.messages || []).slice(0, 10)) {
    const msgResp = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!msgResp.ok) continue;
    const msgData = await msgResp.json();
    const headers = msgData.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
    const dateStr = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
    const date = new Date(dateStr);

    meetings.push({
      id: `gmail-${msg.id}`,
      title: subject,
      attendee: from.split('<')[0].trim() || from,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      location: 'Via email',
      matter: subject.toUpperCase().includes('ODSP') ? 'ODSP' : 'Admin',
      status: 'scheduled',
      source: 'gmail',
    });
  }
  return meetings;
}

// Step 4: Extract contacts from recent Gmail senders.
async function extractContacts(accessToken) {
  const listResp = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!listResp.ok) throw new Error(`Gmail contacts list failed: ${listResp.status}`);
  const listData = await listResp.json();

  const seen = new Map();
  for (const msg of (listData.messages || []).slice(0, 30)) {
    const msgResp = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Date`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!msgResp.ok) continue;
    const msgData = await msgResp.json();
    const headers = msgData.payload?.headers || [];
    const fromRaw = headers.find(h => h.name === 'From')?.value || '';
    const name = fromRaw.split('<')[0].trim().replace(/^"|"$/g, '');
    const email = (fromRaw.match(/<(.+?)>/) || [])[1] || '';
    const dateStr = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

    if (name && email && !seen.has(email)) {
      seen.set(email, {
        name,
        email,
        role: 'Contact from email',
        lastContact: new Date(dateStr).toISOString(),
        source: 'gmail',
      });
    }
  }
  return Array.from(seen.values());
}

// Step 5: Extract documents from Drive.
async function extractDriveDocuments(accessToken) {
  const q = encodeURIComponent(
    "name contains 'medical' or name contains 'health' or name contains 'ODSP' or name contains 'hospital'"
  );
  const resp = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=20&fields=files(id,name,mimeType,webViewLink,modifiedTime)&spaces=drive`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!resp.ok) throw new Error(`Drive list failed: ${resp.status}`);
  const data = await resp.json();
  return (data.files || []).map(file => ({
    id: file.id,
    name: file.name,
    type: file.mimeType,
    link: file.webViewLink,
    lastModified: file.modifiedTime,
    source: 'drive',
  }));
}

export default async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
    });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || '';
  const code = url.searchParams.get('code') || '';

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return json(503, {
      error: 'Google OAuth not configured.',
      help: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Netlify environment variables. See GMAIL_DRIVE_SETUP.md.',
    });
  }

  // Action: generate auth URL for the client to open
  if (action === 'auth') {
    return json(200, { authUrl: buildAuthUrl() });
  }

  // Action: Google redirects here after user consent
  if (action === 'callback' && code) {
    try {
      const tokens = await exchangeCode(code);
      // Return tokens to the client — the frontend stores them in localStorage.
      // Never store in process.env (read-only at runtime) or in the repo.
      return json(200, {
        success: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_in: tokens.expires_in || 3600,
        message: 'Google connected. Store these tokens and pass access_token on sync requests.',
      });
    } catch (err) {
      return json(500, { error: err.message });
    }
  }

  // Action: sync — caller must supply access_token
  if (action === 'sync') {
    let accessToken = '';

    // Accept token from Authorization header or request body
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.slice(7).trim();
    } else if (req.method === 'POST') {
      try {
        const body = await req.json();
        accessToken = body.access_token || '';
        // If the client sends a refresh_token and the access_token is expired,
        // attempt a refresh before proceeding.
        if (!accessToken && body.refresh_token) {
          const refreshed = await refreshAccessToken(body.refresh_token);
          accessToken = refreshed.access_token || '';
        }
      } catch {
        // ignore parse errors
      }
    }

    if (!accessToken) {
      return json(401, {
        error: 'No access token provided.',
        help: 'Call ?action=auth first, complete OAuth consent, then pass access_token in Authorization: Bearer header or POST body.',
      });
    }

    try {
      const [meetings, contacts, documents] = await Promise.all([
        extractMeetings(accessToken),
        extractContacts(accessToken),
        extractDriveDocuments(accessToken),
      ]);

      return json(200, {
        success: true,
        synced: {
          meetings: meetings.length,
          contacts: contacts.length,
          documents: documents.length,
        },
        caseData: {
          userId: 'mattherbert01',
          name: 'Matthew Herbert',
          status: 'Active',
          primaryMatters: ['ODSP'],
          lastSync: new Date().toISOString(),
          keyContacts: contacts,
          upcomingMeetings: meetings,
          documents,
        },
      });
    } catch (err) {
      return json(500, { error: err.message });
    }
  }

  return json(400, { error: 'Invalid action. Use ?action=auth, ?action=callback, or ?action=sync.' });
};
