import React, { useEffect, useState } from 'react';
import { resetMemosClient } from '../grpc/client';
import './Options.css';

interface Settings {
  endpoint: string;
  token: string;
  tags: string[];
}

export default function Options() {
  const [endpoint, setEndpoint] = useState('');
  const [token, setToken] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [status, setStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    // Load saved settings when component mounts
    chrome.storage.sync.get(['endpoint', 'token', 'tags'], (result) => {
      setEndpoint(result.endpoint || 'http://localhost:5230');
      setToken(result.token || '');
      setTags(result.tags || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await chrome.storage.sync.set({
        endpoint: endpoint.trim(),
        token: token.trim(),
        tags
      });
      resetMemosClient();
      setStatus({ message: 'Settings saved successfully!', type: 'success' });
    } catch (err) {
      setStatus({ message: 'Failed to save settings', type: 'error' });
    }

    setTimeout(() => setStatus(null), 3000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, "#" + newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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

        <div className="form-group">
          <label>Available Tags:</label>
          <div className="tags-container">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button 
                  type="button" 
                  className="tag-remove" 
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="tag-input-container">
            #
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
            />
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>
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