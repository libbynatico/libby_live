import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// Email 2FA code generation
function generateTwoFactorCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email 2FA verification (stored in localStorage for demo)
function storeTwoFactorCode(email, code) {
  const codes = JSON.parse(localStorage.getItem('2fa_codes') || '{}');
  codes[email] = {
    code,
    timestamp: Date.now(),
    attempts: 0
  };
  localStorage.setItem('2fa_codes', JSON.stringify(codes));
}

function verifyTwoFactorCode(email, code) {
  const codes = JSON.parse(localStorage.getItem('2fa_codes') || '{}');
  const stored = codes[email];
  
  if (!stored) return false;
  if (Date.now() - stored.timestamp > 10 * 60 * 1000) return false; // 10 min expiry
  if (stored.attempts >= 3) return false; // Max attempts
  
  if (stored.code === code) {
    delete codes[email];
    localStorage.setItem('2fa_codes', JSON.stringify(codes));
    return true;
  }
  
  stored.attempts++;
  localStorage.setItem('2fa_codes', JSON.stringify(codes));
  return false;
}

// Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        profile: {
          firstName: '',
          lastName: '',
          dob: '',
          province: '',
          phone: ''
        },
        medical: {
          conditions: [],
          allergies: [],
          medications: [],
          insuranceProvider: ''
        },
        integrations: {
          googleDrive: {
            vaultFolderId: null,
            lastSync: null,
            status: 'pending'
          },
          gmail: {
            lastSync: null,
            status: 'pending'
          }
        },
        twoFactorAuth: {
          enabled: false,
          method: 'email'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

// Email 2FA Sign-In
export async function signInWithEmail(email) {
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/callback`,
      handleCodeInApp: true
    };
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    
    // Generate 2FA code
    const code = generateTwoFactorCode();
    storeTwoFactorCode(email, code);
    
    // In production, send this via actual email service
    console.log(`2FA Code for ${email}: ${code}`);
    
    return { success: true, requiresCode: true };
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
}

// Verify 2FA code and complete sign-in
export async function verifyAndSignIn(email, code) {
  if (!verifyTwoFactorCode(email, code)) {
    throw new Error('Invalid or expired 2FA code');
  }
  
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      
      // Create user profile if new
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          profile: {
            firstName: '',
            lastName: '',
            dob: '',
            province: '',
            phone: ''
          },
          medical: {
            conditions: [],
            allergies: [],
            medications: [],
            insuranceProvider: ''
          },
          integrations: {
            googleDrive: { vaultFolderId: null, lastSync: null, status: 'pending' },
            gmail: { lastSync: null, status: 'pending' }
          },
          twoFactorAuth: { enabled: true, method: 'email' },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      window.localStorage.removeItem('emailForSignIn');
      return result.user;
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    throw error;
  }
}

// Sign Out
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

// Get Current User
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

// Update User Profile
export async function updateUserProfile(userId, profileData) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      profile: profileData.profile,
      medical: profileData.medical,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

// Get User Profile
export async function getUserProfile(userId) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}
