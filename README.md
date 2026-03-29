# Libby Live - Phase 1: Foundation

Complete Firebase-based authentication system with Google Sign-In, Email 2FA, and user intake form.

## Features Implemented

✅ **Google Sign-In** (OAuth 2.0 with Drive + Gmail scopes)
✅ **Email 2FA** (6-digit code verification)
✅ **User Registration** (Complete intake form with medical data)
✅ **Firestore Schema** (Users, Medical Records, Referrals collections)
✅ **User Dashboard** (Profile overview, medical record, integrations status)
✅ **React + Vite** (Modern SPA with fast dev experience)
✅ **Firebase Integration** (Auth, Firestore, Storage ready)

## Quick Start

### 1. Clone & Install

```bash
cd libby-live-phase1
npm install
```

### 2. Add Google OAuth Client ID

Get your Client ID from Firebase Console → Authentication → Sign-in method → Google

Create `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

Then update `src/services/firebase.js` if using env vars:
```javascript
// Currently using hardcoded config, can be updated to use env vars
```

### 3. Run Locally

```bash
npm run dev
```

Opens at `http://localhost:3000`

## Project Structure

```
libby-live-phase1/
├── src/
│   ├── services/
│   │   ├── firebase.js       # Firebase config & initialization
│   │   └── authService.js    # Auth logic (Google, Email 2FA)
│   ├── pages/
│   │   ├── LoginPage.jsx     # Sign-in UI
│   │   ├── IntakePage.jsx    # Registration form
│   │   └── DashboardPage.jsx # User dashboard
│   ├── styles/
│   │   ├── LoginPage.css
│   │   ├── IntakePage.css
│   │   └── DashboardPage.css
│   ├── App.jsx               # Main app component
│   ├── App.css               # Global styles
│   └── main.jsx              # React entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## User Flow

1. **Login** → Google Sign-In or Email 2FA
2. **Intake Form** → Collect medical data, location, medications
3. **Dashboard** → View profile, medical record, integration status

## Firestore Schema

### users/ collection
```json
{
  "uid": "string",
  "email": "string",
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "dob": "string",
    "province": "string (AB, BC, ON, etc)",
    "phone": "string"
  },
  "medical": {
    "conditions": ["array of strings"],
    "allergies": "string",
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string"
      }
    ],
    "insuranceProvider": "string"
  },
  "integrations": {
    "googleDrive": {
      "vaultFolderId": "string",
      "lastSync": "timestamp",
      "status": "pending|connected|error"
    },
    "gmail": {
      "lastSync": "timestamp",
      "status": "pending|connected|error"
    }
  },
  "twoFactorAuth": {
    "enabled": "boolean",
    "method": "email|totp"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Testing

### Demo Credentials
- **Google Sign-In**: Use any Google account
- **Email 2FA**: Any email → Check browser console for 2FA code

### Test Scenarios
1. Sign in with Google
2. Complete intake form with full medical data
3. View dashboard with populated information
4. Check integrations status (pending)

## Next Steps (Phase 2)

- [ ] Google Drive OAuth + vault creation
- [ ] Gmail sync for correspondence
- [ ] Template folder structure deployment
- [ ] Referral system implementation
- [ ] Medical document upload

## Deployment to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
npm run deploy
```

## Environment Setup

Required Firebase Services:
- ✅ Authentication (Email + Google)
- ✅ Firestore Database
- ✅ Cloud Storage
- ⬜ Cloud Functions (for Phase 2)
- ⬜ Cloud Messaging (optional)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Firebase** - Backend services
- **Firestore** - NoSQL database
- **CSS3** - Styling

## Notes

- 2FA in demo mode shows code in browser console
- Production: Implement actual email sending for 2FA codes
- Firebase security rules need to be set in Firebase Console
- User data persists in Firestore (production-ready)

## Support

For questions or issues, check:
1. Firebase Console (authentication, Firestore)
2. Browser Console (errors, 2FA codes)
3. Vite docs (build issues)
