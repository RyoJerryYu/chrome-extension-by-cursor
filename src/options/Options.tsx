import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  IconButton,
  Chip,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Tag as TagIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { resetMemosClient } from "../grpc/client";
import { memoService } from "../services/memoService";

interface Settings {
  endpoint: string;
  token: string;
  tags: string[];
}

interface TagWithCount {
  name: string;
  count: number;
}

export default function Options() {
  const [endpoint, setEndpoint] = useState("");
  const [token, setToken] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [fetchedTags, setFetchedTags] = useState<TagWithCount[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["endpoint", "token", "tags"], (result) => {
      setEndpoint(result.endpoint || "http://localhost:5230");
      setToken(result.token || "");
      setTags(result.tags || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      
      try {
        await chrome.storage.sync.set({ tags: updatedTags });
        setStatus({ message: "Tag added successfully!", type: "success" });
      } catch (err) {
        setStatus({ message: "Failed to save tag", type: "error" });
      }
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    
    try {
      await chrome.storage.sync.set({ tags: updatedTags });
      setStatus({ message: "Tag removed successfully!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to remove tag", type: "error" });
    }
    setTimeout(() => setStatus(null), 1500);
  };

  const handleFetchTags = async () => {
    setIsFetching(true);
    try {
      const tagAmounts = await memoService.listTags();
      const tagList = Object.entries(tagAmounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setFetchedTags(tagList);
    } catch (err) {
      setStatus({
        message: err instanceof Error ? err.message : "Failed to fetch tags",
        type: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportTag = async (tagName: string) => {
    if (!tags.includes(tagName)) {
      const updatedTags = [...tags, tagName];
      setTags(updatedTags);
      
      try {
        await chrome.storage.sync.set({ tags: updatedTags });
        setStatus({ message: `Added tag: ${tagName}`, type: "success" });
      } catch (err) {
        setStatus({ message: "Failed to import tag", type: "error" });
      }
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Extension Settings
        </Typography>

        <form onSubmit={handleSubmit}>
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
              </Stack>
            </Paper>

            {/* Save Settings Button - Moved here */}
            <Button type="submit" variant="contained" size="large">
              Save Settings
            </Button>

            {/* Tags Management Section */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags Management
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                      icon={<TagIcon />}
                    />
                  ))}
                </Box>

                <TextField
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleAddTag}
                          disabled={!newTag.trim()}
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />

                {/* Server Tags */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    maxHeight: 200,
                    overflowY: "auto",
                    p: 1,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TagIcon color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Server Tags
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <IconButton
                      onClick={handleFetchTags}
                      disabled={isFetching}
                      size="small"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {fetchedTags.length > 0 &&
                      fetchedTags.map(({ name, count }) => (
                        <Chip
                          key={name}
                          label={`${name} (${count})`}
                          size="small"
                          onClick={() => handleImportTag(name)}
                          disabled={tags.includes(name)}
                          variant="outlined"
                          icon={<TagIcon />}
                        />
                      ))}
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </form>

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
