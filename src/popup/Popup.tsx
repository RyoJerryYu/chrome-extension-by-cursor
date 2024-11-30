import React, { useState, useRef, useEffect } from "react";
import { memoService } from "../services/memoService";
import { resourceService } from "../services/resourceService";
import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { Resource } from "../../proto/src/proto/api/v1/resource_service";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backendEndpoint, setBackendEndpoint] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(['endpoint'], (result) => {
      setBackendEndpoint(result.endpoint || 'http://localhost:5230');
    });
  }, []);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // First create the memo
      const memo = await memoService.createMemo(content);

      // If there's a file selected, upload it and attach to memo
      if (selectedFile) {
        setIsUploading(true);
        try {
          const resource = await resourceService.createResource(selectedFile);
          await memoService.setMemoResources(memo.name, [resource]);
        } catch (err) {
          console.error('Failed to upload file:', err);
          // Don't fail the whole operation if file upload fails
        } finally {
          setIsUploading(false);
        }
      }

      setCreatedMemo(memo);
      setContent("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create memo");
    } finally {
      setIsLoading(false);
    }
  };

  const insertCurrentPage = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url && tab.title) {
        const markdownLink = `[${tab.title}](${tab.url})`;
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
          const newContent = start + markdownLink + end;
          const cursorAt = start.length + markdownLink.length;
          setContent(newContent);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorAt, cursorAt);
          }, 0);
        } else {
          setContent(content + markdownLink);
        }
      }
    } catch (err) {
      console.error('Failed to get current tab:', err);
    }
  };

  const handleOpenMemo = (memo: Memo) => {
    // Extract UID from memo.name (format: "memos/{uid}")
    const uid = memo.uid;
    const memoUrl = `${backendEndpoint}/m/${uid}`;
    window.open(memoUrl, '_blank');
  };

  const insertTask = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const startAt = textarea.selectionStart;
      let start = content.substring(0, startAt).trimEnd();
      let end = content.substring(startAt).trimStart();
      
      // Add newline before task if we're not at the start of content
      if (start.length !== 0 && !start.endsWith('\n')) {
        start += '\n';
      }
      
      // Add newline after task if there's content after
      if (end.length !== 0 && !end.startsWith('\n')) {
        end = '\n' + end;
      }
      
      const taskText = "- [ ] ";
      const newContent = start + taskText + end;
      const cursorAt = start.length + taskText.length;
      
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorAt, cursorAt);
      }, 0);
    } else {
      setContent(content + "- [ ] ");
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

      <div className="actions-section mb-2">
        <button
          type="button"
          className="action-button"
          onClick={insertCurrentPage}
        >
          Insert Current Page
        </button>
        <button
          type="button"
          className="action-button"
          onClick={insertTask}
        >
          Add Task
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-2 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your memo content..."
          disabled={isLoading}
        />

        <div className="file-section mb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="file-button"
            disabled={isLoading}
          >
            {selectedFile ? selectedFile.name : "Attach File"}
          </button>
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="remove-file"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="btn-primary"
        >
          {isLoading ? (isUploading ? "Uploading..." : "Creating...") : "Create Memo"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {createdMemo && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p>Memo created successfully!</p>
              <p className="text-sm mt-1">ID: {createdMemo.name}</p>
            </div>
            <button
              type="button"
              className="open-memo-button"
              onClick={() => handleOpenMemo(createdMemo)}
            >
              Open Memo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
