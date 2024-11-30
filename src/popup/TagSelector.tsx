import React from 'react';
import './TagSelector.css';

interface TagSelectorProps {
  onSelectTag: (tag: string) => void;
}

export function TagSelector({ onSelectTag }: TagSelectorProps) {
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    chrome.storage.sync.get(['tags'], (result) => {
      setTags(result.tags || []);
    });
  }, []);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="tag-selector">
      {tags.map((tag) => (
        <button
          key={tag}
          className="tag-button"
          onClick={() => onSelectTag(tag)}
          type="button"
        >
          {tag}
        </button>
      ))}
    </div>
  );
} 