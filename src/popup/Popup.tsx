import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton,
  Stack,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Tooltip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { memoService } from "../services/memoService";
import { resourceService } from "../services/resourceService";
import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { Resource } from "../../proto/src/proto/api/v1/resource_service";
import { TagSelector } from "./TagSelector";

export default function Popup() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

      // If there are files selected, upload them and attach to memo
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const resources: Resource[] = [];
          for (const file of selectedFiles) {
            const resource = await resourceService.createResource(file);
            resources.push(resource);
          }
          await memoService.setMemoResources(memo.name, resources);
        } catch (err) {
          console.error('Failed to upload files:', err);
          // Don't fail the whole operation if file upload fails
        } finally {
          setIsUploading(false);
        }
      }

      setCreatedMemo(memo);
      setContent("");
      setSelectedFiles([]);
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
      
      if (start.length !== 0 && !start.endsWith('\n')) {
        start += '\n';
      }
      
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

        {/* Action Buttons */}
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-start">
            <Tooltip title="Insert Current Page">
              <IconButton
                onClick={insertCurrentPage}
                disabled={isLoading}
                color="primary"
                size="small"
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Task Checkbox">
              <IconButton
                onClick={insertTask}
                disabled={isLoading}
                color="primary"
                size="small"
              >
                <AddTaskIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Attach Files">
              <IconButton
                onClick={handleFileClick}
                disabled={isLoading}
                color="primary"
                size="small"
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              multiple
            />
          </Stack>
        </Paper>

        <TagSelector onSelectTag={handleTagSelect} />

        {/* File List Section */}
        {selectedFiles.length > 0 && (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List dense sx={{ 
              maxHeight: 100, 
              overflowY: 'auto',
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              {selectedFiles.map((file, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText 
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

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
