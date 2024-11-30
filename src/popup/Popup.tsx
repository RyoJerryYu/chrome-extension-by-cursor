import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Stack,
  Paper,
  Alert,
  AlertTitle,
  Chip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import TagIcon from '@mui/icons-material/Tag';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
    <Box sx={{ width: 400, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Create Memo
      </Typography>

      <Stack spacing={2}>
        <TagSelector onSelectTag={handleTagSelect} />

        {/* Server Tags Section */}
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Stack spacing={1}>
            <Button
              startIcon={<TagIcon />}
              onClick={handleFetchTags}
              disabled={isFetchingTags}
              variant="outlined"
              fullWidth
            >
              {isFetchingTags ? "Fetching..." : "Fetch Server Tags"}
            </Button>

            {serverTags.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5,
                maxHeight: 120,
                overflowY: 'auto',
                p: 1,
                bgcolor: 'grey.50',
                borderRadius: 1
              }}>
                {serverTags.map(({ name, count }) => (
                  <Chip
                    key={name}
                    label={`${name} (${count})`}
                    size="small"
                    onClick={() => handleTagSelect(name)}
                    variant="outlined"
                    icon={<TagIcon />}
                  />
                ))}
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<LinkIcon />}
            variant="outlined"
            onClick={insertCurrentPage}
            fullWidth
          >
            Insert Page
          </Button>
          <Button
            startIcon={<AddTaskIcon />}
            variant="outlined"
            onClick={insertTask}
            fullWidth
          >
            Add Task
          </Button>
        </Stack>

        {/* Main Content */}
        <TextField
          multiline
          minRows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your memo content..."
          disabled={isLoading}
          fullWidth
        />

        {/* File Upload Section */}
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              startIcon={<AttachFileIcon />}
              variant="text"
              onClick={handleFileClick}
              disabled={isLoading}
              fullWidth
            >
              {selectedFile ? selectedFile.name : "Attach File"}
            </Button>
            {selectedFile && (
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </Paper>

        {/* Submit Button */}
        <Button
          variant="contained"
          disabled={isLoading || !content.trim()}
          onClick={handleSubmit}
          fullWidth
        >
          {isLoading ? (isUploading ? "Uploading..." : "Creating...") : "Create Memo"}
        </Button>
      </Stack>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {createdMemo && (
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
          action={
            <Button
              color="success"
              size="small"
              endIcon={<OpenInNewIcon />}
              onClick={() => handleOpenMemo(createdMemo)}
            >
              Open
            </Button>
          }
        >
          <AlertTitle>Success</AlertTitle>
          <Typography variant="body2">
            Memo created successfully!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {createdMemo.name}
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
