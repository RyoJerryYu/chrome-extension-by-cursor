import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import { resetMemosClient } from "../grpc/client";
import { TagsManagement } from "./TagsManagement";

interface Settings {
  endpoint: string;
  token: string;
}

export default function Options() {
  const [endpoint, setEndpoint] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(["endpoint", "token"], (result) => {
      setEndpoint(result.endpoint || "http://localhost:5230");
      setToken(result.token || "");
    });
  }, []);

  const handleSaveSettings = async () => {
    if (!endpoint.trim() || !token.trim()) {
      setStatus({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    try {
      await chrome.storage.sync.set({
        endpoint: endpoint.trim(),
        token: token.trim(),
      });
      resetMemosClient();
      setStatus({ message: "Settings saved successfully!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to save settings", type: "error" });
    }

    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Extension Settings
        </Typography>

        <Stack spacing={3}>
          {/* Connection Settings */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Connection Settings
              </Typography>

              <TextField
                label="Backend Endpoint"
                type="url"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://your-backend-url"
                required
                fullWidth
              />

              <TextField
                label="Authentication Token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Your JWT token"
                required
                fullWidth
              />

              <Button
                onClick={handleSaveSettings}
                variant="contained"
                size="large"
              >
                Save Settings
              </Button>
            </Stack>
          </Paper>

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
