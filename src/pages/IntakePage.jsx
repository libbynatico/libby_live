import { useState } from 'react';
import { updateUserProfile } from '../services/authService';
import '../styles/IntakePage.css';

const CANADIAN_PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

const COMMON_CONDITIONS = [
  'Type 2 Diabetes',
  'Hypertension',
  'Heart Disease',
  'Asthma',
  'COPD',
  'Arthritis',
  'Depression',
  'Anxiety',
  'Other'
];

export default function IntakePage({ user, onNavigate, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      dob: '',
      province: '',
      phone: ''
    },
    medical: {
      conditions: [],
      allergies: '',
      medications: [],
      insuranceProvider: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      medical: {
        ...prev.medical,
        conditions: prev.medical.conditions.includes(condition)
          ? prev.medical.conditions.filter(c => c !== condition)
          : [...prev.medical.conditions, condition]
      }
    }));
  };

  const handleAddMedication = () => {
    setFormData(prev => ({
      ...prev,
      medical: {
        ...prev.medical,
        medications: [
          ...prev.medical.medications,
          { name: '', dosage: '', frequency: '' }
        ]
      }
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medical: {
        ...prev.medical,
        medications: prev.medical.medications.map((med, i) => 
          i === index ? { ...med, [field]: value } : med
        )
      }
    }));
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medical: {
        ...prev.medical,
        medications: prev.medical.medications.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUserProfile(user.uid, formData);
      onProfileUpdate(formData);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="intake-container">
      <form onSubmit={handleSubmit} className="intake-form">
        <h2>Complete Your Profile</h2>

        {error && <div className="error-message">{error}</div>}

        {/* Personal Information */}
        <section className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <input
              type="text"
              name="profile.firstName"
              value={formData.profile.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="profile.lastName"
              value={formData.profile.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>

          <div className="form-row">
            <input
              type="date"
              name="profile.dob"
              value={formData.profile.dob}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="profile.phone"
              value={formData.profile.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          </div>

          <select
            name="profile.province"
            value={formData.profile.province}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Province/Territory</option>
            {CANADIAN_PROVINCES.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </section>

        {/* Medical Information */}
        <section className="form-section">
          <h3>Medical Information</h3>

          <div className="conditions">
            <label>Medical Conditions (select all that apply):</label>
            {COMMON_CONDITIONS.map(condition => (
              <label key={condition} className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.medical.conditions.includes(condition)}
                  onChange={() => handleConditionToggle(condition)}
                />
                {condition}
              </label>
            ))}
          </div>

          <textarea
            name="medical.allergies"
            value={formData.medical.allergies}
            onChange={handleInputChange}
            placeholder="Known allergies (separated by commas)"
            rows="3"
          />

          <div className="medications-section">
            <h4>Current Medications</h4>
            {formData.medical.medications.map((med, index) => (
              <div key={index} className="medication-item">
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  placeholder="Medication name"
                />
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="Dosage (e.g., 500mg)"
                />
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  placeholder="Frequency (e.g., Twice daily)"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMedication}
              className="btn-secondary"
            >
              + Add Medication
            </button>
          </div>

          <input
            type="text"
            name="medical.insuranceProvider"
            value={formData.medical.insuranceProvider}
            onChange={handleInputChange}
            placeholder="Insurance Provider (optional)"
          />
        </section>

        <button type="submit" disabled={loading} className="btn-primary btn-submit">
          {loading ? 'Saving...' : 'Complete Intake & Continue'}
        </button>
      </form>
    </div>
  );
}
