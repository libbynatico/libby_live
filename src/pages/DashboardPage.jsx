import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';
import '../styles/DashboardPage.css';

export default function DashboardPage({ user, profile: initialProfile }) {
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!initialProfile) {
      getUserProfile(user.uid).then(data => {
        setProfile(data);
        setLoading(false);
      });
    }
  }, [user.uid, initialProfile]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Failed to load profile</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical Record
        </button>
        <button
          className={`tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <section className="dashboard-section">
            <h2>Welcome, {profile.profile.firstName || 'User'}</h2>
            <div className="profile-summary">
              <div className="summary-card">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {profile.profile.firstName} {profile.profile.lastName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Province:</strong> {profile.profile.province}</p>
                <p><strong>Phone:</strong> {profile.profile.phone || 'Not provided'}</p>
              </div>

              <div className="summary-card">
                <h3>Quick Stats</h3>
                <p><strong>Medical Conditions:</strong> {profile.medical.conditions.length}</p>
                <p><strong>Medications:</strong> {profile.medical.medications.length}</p>
                <p><strong>Account Created:</strong> {new Date(profile.createdAt?.toDate?.() || profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="next-steps">
              <h3>Next Steps</h3>
              <ul>
                <li>Connect your Google Drive to create your memory vault</li>
                <li>Connect Gmail to auto-import medical correspondence</li>
                <li>Upload your medical documents</li>
                <li>Start chatting with Libby about your health</li>
              </ul>
            </div>
          </section>
        )}

        {activeTab === 'medical' && (
          <section className="dashboard-section">
            <h2>Medical Record</h2>
            
            <div className="medical-card">
              <h3>Conditions</h3>
              {profile.medical.conditions.length > 0 ? (
                <ul>
                  {profile.medical.conditions.map(condition => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p>No conditions recorded</p>
              )}
            </div>

            <div className="medical-card">
              <h3>Allergies</h3>
              <p>{profile.medical.allergies || 'No known allergies'}</p>
            </div>

            <div className="medical-card">
              <h3>Current Medications</h3>
              {profile.medical.medications.length > 0 ? (
                <table className="medications-table">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.medical.medications.map((med, idx) => (
                      <tr key={idx}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No medications recorded</p>
              )}
            </div>

            <div className="medical-card">
              <h3>Insurance</h3>
              <p>{profile.medical.insuranceProvider || 'Not recorded'}</p>
            </div>
          </section>
        )}

        {activeTab === 'integrations' && (
          <section className="dashboard-section">
            <h2>Integrations</h2>

            <div className="integration-card">
              <h3>Google Drive</h3>
              <p className={`status ${profile.integrations.googleDrive.status}`}>
                Status: {profile.integrations.googleDrive.status}
              </p>
              {profile.integrations.googleDrive.status === 'pending' ? (
                <button className="btn-primary">Connect Google Drive</button>
              ) : (
                <div>
                  <p>✓ Connected</p>
                  <p>Vault ID: {profile.integrations.googleDrive.vaultFolderId}</p>
                  <button className="btn-secondary">Disconnect</button>
                </div>
              )}
            </div>

            <div className="integration-card">
              <h3>Gmail</h3>
              <p className={`status ${profile.integrations.gmail.status}`}>
                Status: {profile.integrations.gmail.status}
              </p>
              {profile.integrations.gmail.status === 'pending' ? (
                <button className="btn-primary">Connect Gmail</button>
              ) : (
                <div>
                  <p>✓ Connected</p>
                  <p>Last Sync: {profile.integrations.gmail.lastSync || 'Never'}</p>
                  <button className="btn-secondary">Disconnect</button>
                </div>
              )}
            </div>

            <div className="integration-info">
              <p>These integrations allow Libby to access your documents and correspondence to provide better recommendations.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
