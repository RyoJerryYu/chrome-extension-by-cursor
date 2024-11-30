import React, { useEffect, useState } from 'react';
import './Options.css';

export default function Options() {
  const [endpoint, setEndpoint] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    // Load saved settings when component mounts
    chrome.storage.sync.get(['endpoint', 'token'], (result) => {
      setEndpoint(result.endpoint || 'http://localhost:5230');
      setToken(result.token || '');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await chrome.storage.sync.set({
        endpoint: endpoint.trim(),
        token: token.trim()
      });
      setStatus({ message: 'Settings saved successfully!', type: 'success' });
    } catch (err) {
      setStatus({ message: 'Failed to save settings', type: 'error' });
    }

    // Clear status after 3 seconds
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="options-container">
      <h1>Extension Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="endpoint">Backend Endpoint:</label>
          <input
            type="url"
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://your-backend-url"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="token">Authentication Token:</label>
          <input
            type="password"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Your JWT token"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Save Settings
        </button>
      </form>

      {status && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
} 