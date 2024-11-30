import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { resetMemosClient } from "../grpc/client";

interface ConnectionSettingsProps {
  setStatus: (status: { message: string; type: "success" | "error" } | null) => void;
}

export function ConnectionSettings({ setStatus }: ConnectionSettingsProps) {
  const [endpoint, setEndpoint] = useState("");
  const [token, setToken] = useState("");

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
  );
} 