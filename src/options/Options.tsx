import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { ConnectionSettings } from "./ConnectionSettings";
import { TagsManagement } from "./TagsManagement";

export default function Options() {
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Extension Settings
        </Typography>

        <Stack spacing={3}>
          {/* Connection Settings */}
          <ConnectionSettings setStatus={setStatus} />

          {/* Tags Management Section */}
          <TagsManagement setStatus={setStatus} />
        </Stack>

        {status && (
          <Alert
            severity={status.type}
            sx={{ mt: 2 }}
            onClose={() => setStatus(null)}
          >
            {status.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
