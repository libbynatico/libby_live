import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, verifyAndSignIn } from '../services/authService';
import '../styles/LoginPage.css';

export default function LoginPage({ onNavigate }) {
  const [authMode, setAuthMode] = useState('google'); // google or email
  const [email, setEmail] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [step, setStep] = useState('initial'); // initial, verify-2fa
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onNavigate('intake');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmail(email);
      setStep('verify-2fa');
      setError('Check console for 2FA code (demo mode)');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyAndSignIn(email, twoFACode);
      onNavigate('intake');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Libby Live</h1>
        <p className="subtitle">Evidence-Based Patient Communication</p>

        {error && <div className="error-message">{error}</div>}

        {step === 'initial' ? (
          <>
            <div className="auth-mode-selector">
              <button
                className={`mode-btn ${authMode === 'google' ? 'active' : ''}`}
                onClick={() => setAuthMode('google')}
              >
                Google Sign-In
              </button>
              <button
                className={`mode-btn ${authMode === 'email' ? 'active' : ''}`}
                onClick={() => setAuthMode('email')}
              >
                Email Sign-In
              </button>
            </div>

            {authMode === 'google' ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-google"
              >
                {loading ? 'Signing in...' : 'Sign In with Google'}
              </button>
            ) : (
              <form onSubmit={handleEmailSignIn}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Sending...' : 'Send Sign-In Link'}
                </button>
              </form>
            )}

            <div className="demo-info">
              <p>Demo Mode: Use any email and you'll receive a 2FA code.</p>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerify2FA}>
            <h2>Verify 2FA Code</h2>
            <p>Check browser console for your 2FA code</p>
            <input
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('initial');
                setEmail('');
                setTwoFACode('');
              }}
              className="btn-secondary"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
