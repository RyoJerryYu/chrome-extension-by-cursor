import React, { useState } from "react";
import { memoService } from "../services/memoService";
import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { TagSelector } from "./TagSelector";

interface ServerTag {
  name: string;
  count: number;
}

export default function Popup() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);
  const [serverTags, setServerTags] = useState<ServerTag[]>([]);
  const [isFetchingTags, setIsFetchingTags] = useState(false);

  const handleTagSelect = (tag: string) => {
    const inputTag = "#" + tag;
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const startAt = textarea.selectionStart;
      const endAt = textarea.selectionEnd;
      let start = content.substring(0, startAt).trimEnd();
      if (start.length !== 0) {
        start += " ";
      }
      let end = content.substring(endAt).trimStart();
      if (end.length !== 0) {
        end = " " + end;
      }
      const newContent = start + inputTag + end;
      const cursorAt = start.length + inputTag.length;
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorAt, cursorAt);
      }, 0);
    } else {
      setContent(content + inputTag);
    }
  };

  const handleFetchTags = async () => {
    setIsFetchingTags(true);
    setError(null);
    try {
      const tagAmounts = await memoService.listTags();
      const tagList = Object.entries(tagAmounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setServerTags(tagList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
    } finally {
      setIsFetchingTags(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const memo = await memoService.createMemo(content);
      setCreatedMemo(memo);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create memo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-container">
      <h1 className="text-xl font-bold mb-4">Create Memo</h1>

      <div className="tags-section">
        <TagSelector onSelectTag={handleTagSelect} />

        <div className="server-tags">
          <button
            type="button"
            className="fetch-tags-button"
            onClick={handleFetchTags}
            disabled={isFetchingTags}
          >
            {isFetchingTags ? "Fetching..." : "Fetch Server Tags"}
          </button>

          {serverTags.length > 0 && (
            <div className="server-tags-list">
              {serverTags.map(({ name, count }) => (
                <button
                  key={name}
                  type="button"
                  className="server-tag"
                  onClick={() => handleTagSelect(name)}
                >
                  {name} ({count})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
          {isLoading ? "Creating..." : "Create Memo"}
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
