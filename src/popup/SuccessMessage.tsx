import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Typography, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Memo } from "../../proto/src/proto/api/v1/memo_service";

interface SuccessMessageProps {
  memo: Memo;
}

export function SuccessMessage({ memo }: SuccessMessageProps) {
  const [backendEndpoint, setBackendEndpoint] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(['endpoint'], (result) => {
      setBackendEndpoint(result.endpoint || 'http://localhost:5230');
    });
  }, []);

  const handleOpenMemo = () => {
    const uid = memo.uid;
    const memoUrl = `${backendEndpoint}/m/${uid}`;
    window.open(memoUrl, '_blank');
  };

  return (
    <Alert 
      severity="success" 
      sx={{ mt: 2 }}
      action={
        <Button
          color="success"
          size="small"
          endIcon={<OpenInNewIcon />}
          onClick={handleOpenMemo}
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
        ID: {memo.name}
      </Typography>
    </Alert>
  );
} 