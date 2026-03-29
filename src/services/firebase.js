import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAK_swOOrnXLah3kApGy5sApOgDAwouAjU",
  authDomain: "libby-live.firebaseapp.com",
  projectId: "libby-live",
  storageBucket: "libby-live.firebasestorage.app",
  messagingSenderId: "496222615700",
  appId: "1:496222615700:web:8f9b7d44badd919765dc81",
  measurementId: "G-FD0LD4LXJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(err => 
  console.error('Auth persistence error:', err)
);

// Initialize Firestore
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support all of the features required to enable persistence');
  }
});

// Initialize Storage
const storage = getStorage(app);

// Initialize Google Auth Provider with Client ID
const googleProvider = new GoogleAuthProvider();
// Set the Google Client ID for the OAuth flow
googleProvider.setCustomParameters({
  'client_id': '496222615700-0cjpmdrhsntc6lvdmrdu420oab75jusq.apps.googleusercontent.com'
});
googleProvider.addScope('https://www.googleapis.com/auth/drive');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export { auth, db, storage, googleProvider };
