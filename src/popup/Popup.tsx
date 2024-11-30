import React, { useState } from 'react';
import { memoService } from '../services/memoService';
import { Memo } from '../../proto/src/proto/api/v1/memo_service';
import { TagSelector } from './TagSelector';

export default function Popup() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);

  const handleTagSelect = (tag: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + tag + content.substring(end);
      setContent(newContent);
      // Set cursor position after the inserted tag
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      setContent(content + tag);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const memo = await memoService.createMemo(content);
      setCreatedMemo(memo);
      setContent(''); // Clear input after successful creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create memo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-container">
      <h1 className="text-xl font-bold mb-4">Create Memo</h1>
      
      <TagSelector onSelectTag={handleTagSelect} />
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your memo content..."
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="btn-primary"
        >
          {isLoading ? 'Creating...' : 'Create Memo'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {createdMemo && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Memo created successfully!</p>
          <p className="text-sm mt-1">ID: {createdMemo.name}</p>
        </div>
      )}
    </div>
  );
} 