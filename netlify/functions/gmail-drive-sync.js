// Gmail + Drive auto-sync for Libby Live
// Extracts meetings, contacts, medical records → auto-updates cases.json

import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

// Initialize OAuth2 client
function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.SITE_URL}/.netlify/functions/gmail-drive-sync?action=callback`
  );
  return oauth2Client;
}

// Step 1: Generate OAuth consent URL
async function generateAuthUrl(req, res) {
  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ authUrl }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Step 2: Handle OAuth callback
async function handleCallback(code) {
  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Store token in secure session/cache
    // In production: use Netlify encrypted environment or secure session store
    process.env.GMAIL_DRIVE_TOKEN = JSON.stringify(tokens);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Gmail and Drive connected. Auto-sync starting...'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Step 3: Extract meetings from Gmail
async function extractMeetings(oauth2Client) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Search for emails with meeting keywords
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:(ODSP OR meeting OR appointment OR review) after:2026-04-01'
    });

    const meetings = [];
    if (res.data.messages) {
      for (const message of res.data.messages.slice(0, 10)) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        const headers = msg.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

        meetings.push({
          id: `meeting-${message.id}`,
          title: subject,
          attendee: from,
          date: new Date(date).toISOString().split('T')[0],
          time: new Date(date).toISOString().split('T')[1],
          location: 'Email',
          matter: subject.includes('ODSP') ? 'ODSP' : 'Admin',
          status: 'scheduled',
          source: 'gmail'
        });
      }
    }

    return meetings;
  } catch (error) {
    console.error('Error extracting meetings:', error);
    return [];
  }
}

// Step 4: Extract contacts from Gmail
async function extractContacts(oauth2Client) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 50
    });

    const contacts = new Map();

    if (res.data.messages) {
      for (const message of res.data.messages) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        const headers = msg.data.payload.headers;
        const from = headers.find(h => h.name === 'From')?.value || '';
        const name = from.split('<')[0].trim();
        const email = from.match(/<(.+)>/)?.[1] || '';

        if (name && email && !contacts.has(email)) {
          contacts.set(email, {
            name: name,
            role: 'Contact from email',
            email: email,
            lastContact: new Date(headers.find(h => h.name === 'Date')?.value).toISOString(),
            source: 'gmail'
          });
        }
      }
    }

    return Array.from(contacts.values());
  } catch (error) {
    console.error('Error extracting contacts:', error);
    return [];
  }
}

// Step 5: Extract documents from Drive
async function extractDriveDocuments(oauth2Client) {
  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Search for medical/health related documents
    const res = await drive.files.list({
      q: "name contains 'medical' or name contains 'health' or name contains 'ODSP' or name contains 'hospital'",
      spaces: 'drive',
      pageSize: 20,
      fields: 'files(id, name, mimeType, webViewLink, modifiedTime)'
    });

    return res.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      link: file.webViewLink,
      lastModified: file.modifiedTime,
      source: 'drive'
    })) || [];
  } catch (error) {
    console.error('Error extracting Drive documents:', error);
    return [];
  }
}

// Step 6: Compile into cases.json format
async function compileCaseData(meetings, contacts, documents) {
  return {
    userId: 'mattherbert01',
    name: 'Matthew Herbert',
    dob: '1986-03-15',
    status: 'Active',
    primaryMatters: ['ODSP', 'Medical'],
    caseNotes: 'Auto-synced from Gmail/Drive',
    keyContacts: contacts,
    upcomingMeetings: meetings,
    documents: documents,
    lastSync: new Date().toISOString()
  };
}

// Main handler
export default async (req) => {
  const { action, code } = req.query;

  try {
    if (action === 'auth') {
      // Generate OAuth URL
      return await generateAuthUrl(req);
    }

    if (action === 'callback' && code) {
      // Handle OAuth callback
      return await handleCallback(code);
    }

    if (action === 'sync') {
      // Check if token exists
      if (!process.env.GMAIL_DRIVE_TOKEN) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Not authenticated. Visit /.netlify/functions/gmail-drive-sync?action=auth first'
          })
        };
      }

      // Sync Gmail/Drive data
      const oauth2Client = getOAuth2Client();
      const tokens = JSON.parse(process.env.GMAIL_DRIVE_TOKEN);
      oauth2Client.setCredentials(tokens);

      const [meetings, contacts, documents] = await Promise.all([
        extractMeetings(oauth2Client),
        extractContacts(oauth2Client),
        extractDriveDocuments(oauth2Client)
      ]);

      const caseData = await compileCaseData(meetings, contacts, documents);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          synced: {
            meetings: meetings.length,
            contacts: contacts.length,
            documents: documents.length
          },
          caseData: caseData
        })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
