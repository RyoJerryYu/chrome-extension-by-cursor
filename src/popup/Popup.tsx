import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  Alert,
  AlertTitle,
  List,
  Tooltip,
} from "@mui/material";

import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { TagSelector } from "./TagSelector";
import { FileUploadButton } from "./FileUploadButton";
import { FileItem } from "./FileItem";
import { InsertPageButton } from "./InsertPageButton";
import { InsertTaskButton } from "./InsertTaskButton";
import { SubmitButton } from "./SubmitButton";
import { SuccessMessage } from "./SuccessMessage";

export default function Popup() {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleSubmitEnd = () => {
    setIsLoading(false);
  };

  const handleSubmitSuccess = (memo: Memo) => {
    setCreatedMemo(memo);
    setContent("");
    setSelectedFiles([]);
  };

  const handleSubmitError = (errorMessage: string) => {
    setError(errorMessage);
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
            <InsertPageButton
              textFieldRef={textFieldRef}
              content={content}
              setContent={setContent}
              disabled={isLoading}
            />
            <InsertTaskButton
              textFieldRef={textFieldRef}
              content={content}
              setContent={setContent}
              disabled={isLoading}
            />
            <FileUploadButton
              onFilesSelected={handleFilesSelected}
              disabled={isLoading}
            />
          </Stack>
        </Paper>

        <TagSelector
          textFieldRef={textFieldRef}
          content={content}
          setContent={setContent}
          disabled={isLoading}
        />

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
        <SubmitButton
          content={content}
          selectedFiles={selectedFiles}
          onSuccess={handleSubmitSuccess}
          onError={handleSubmitError}
          onSubmitStart={handleSubmitStart}
          onSubmitEnd={handleSubmitEnd}
          disabled={isLoading}
        />
      </Stack>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {createdMemo && <SuccessMessage memo={createdMemo} />}
    </Box>
  );
}
