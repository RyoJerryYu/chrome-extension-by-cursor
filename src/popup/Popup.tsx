import React, { useState, useEffect, useRef } from "react";
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
  Button,
  Tooltip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { memoService } from "../services/memoService";
import { resourceService } from "../services/resourceService";
import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { Resource } from "../../proto/src/proto/api/v1/resource_service";
import { TagSelector } from "./TagSelector";
import { FileUploadButton } from "./FileUploadButton";
import { FileItem } from "./FileItem";

export default function Popup() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [backendEndpoint, setBackendEndpoint] = useState("");
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chrome.storage.sync.get(['endpoint'], (result) => {
      setBackendEndpoint(result.endpoint || 'http://localhost:5230');
    });
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);
  };

  const handleTagSelect = (tag: string) => {
    const inputTag = "#" + tag;
    const textField = textFieldRef.current;
    
    if (textField) {
      const startAt = textField.selectionStart;
      const endAt = textField.selectionEnd;
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
        textField.focus();
        textField.setSelectionRange(cursorAt, cursorAt);
      }, 0);
    } else {
      setContent(content + inputTag);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
        const textField = textFieldRef.current;
        if (textField) {
          const startAt = textField.selectionStart;
          const endAt = textField.selectionEnd;
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
            textField.focus();
            textField.setSelectionRange(cursorAt, cursorAt);
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
    const textField = textFieldRef.current;
    if (textField) {
      const startAt = textField.selectionStart;
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
        textField.focus();
        textField.setSelectionRange(cursorAt, cursorAt);
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
          inputRef={textFieldRef}
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
              <FileUploadButton
                onFilesSelected={handleFilesSelected}
                disabled={isLoading}
              />
            </Tooltip>
          </Stack>
        </Paper>

        <TagSelector onSelectTag={handleTagSelect} />

        {/* File List Section */}
        {selectedFiles.length > 0 && (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List dense sx={{ 
              maxHeight: 200,
              overflowY: 'auto',
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              {selectedFiles.map((file, index) => (
                <FileItem
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFile(index)}
                />
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
