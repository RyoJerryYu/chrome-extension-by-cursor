import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { ConnectionSettings } from "./ConnectionSettings";
import { TagsManagement } from "./TagsManagement";
import { useStatusMessage } from "../hooks/useStatusMessage";

export default function Options() {
  const { status, showStatus, handleOperation } = useStatusMessage();

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Extension Settings
        </Typography>

        <Stack spacing={3}>
          <ConnectionSettings 
            showStatus={showStatus} 
            handleOperation={handleOperation}
          />
          <TagsManagement 
            showStatus={showStatus} 
            handleOperation={handleOperation}
          />
        </Stack>

        {status && (
          <Alert
            severity={status.type}
            sx={{ mt: 2 }}
            onClose={() => showStatus("", "success")}
          >
            {status.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
