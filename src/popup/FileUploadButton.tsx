import React, { useRef } from 'react';
import { IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUploadButton({ onFilesSelected, disabled = false }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
      // Reset input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        color="primary"
        size="small"
      >
        <AttachFileIcon />
      </IconButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
      />
    </>
  );
} 