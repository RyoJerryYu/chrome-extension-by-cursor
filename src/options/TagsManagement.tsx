import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Tag as TagIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { memoService } from "../services/memoService";

interface TagWithCount {
  name: string;
  count: number;
}

interface TagsManagementProps {
  setStatus: (status: { message: string; type: "success" | "error" } | null) => void;
}

export function TagsManagement({ setStatus }: TagsManagementProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [fetchedTags, setFetchedTags] = useState<TagWithCount[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["tags"], (result) => {
      setTags(result.tags || []);
    });
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      
      try {
        await chrome.storage.sync.set({ tags: updatedTags });
        setNewTag("");
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
              handleAddTag();
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
  );
} 