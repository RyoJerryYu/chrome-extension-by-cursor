import React from 'react';
import { Button } from '@mui/material';
import { Memo } from "../../proto/src/proto/api/v1/memo_service";
import { Resource } from "../../proto/src/proto/api/v1/resource_service";
import { memoService } from "../services/memoService";
import { resourceService } from "../services/resourceService";

interface SubmitButtonProps {
  content: string;
  selectedFiles: File[];
  onSuccess: (memo: Memo) => void;
  onError: (error: string) => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
  disabled?: boolean;
}

export function SubmitButton({ 
  content, 
  selectedFiles,
  onSuccess,
  onError,
  onSubmitStart,
  onSubmitEnd,
  disabled = false 
}: SubmitButtonProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStart();
    
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

      onSuccess(memo);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create memo");
    } finally {
      onSubmitEnd();
    }
  };

  return (
    <Button
      variant="contained"
      disabled={disabled || !content.trim()}
      onClick={handleSubmit}
      fullWidth
    >
      {disabled ? (isUploading ? "Uploading..." : "Creating...") : "Create Memo"}
    </Button>
  );
} 