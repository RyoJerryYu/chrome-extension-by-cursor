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
import { ShowStatus, HandleOperation } from "../hooks/useStatusMessage";

interface TagWithCount {
  name: string;
  count: number;
}

interface TagsManagementProps {
  showStatus: ShowStatus;
  handleOperation: HandleOperation;
}

export function TagsManagement({ showStatus, handleOperation }: TagsManagementProps) {
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
      
      await handleOperation(
        async () => {
          await chrome.storage.sync.set({ tags: updatedTags });
          setTags(updatedTags);
          setNewTag("");
        },
        {
          successMessage: "Tag added successfully!",
          errorMessage: "Failed to save tag",
        }
      );
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    
    await handleOperation(
      async () => {
        await chrome.storage.sync.set({ tags: updatedTags });
        setTags(updatedTags);
      },
      {
        successMessage: "Tag removed successfully!",
        errorMessage: "Failed to remove tag",
      }
    );
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
      showStatus(
        err instanceof Error ? err.message : "Failed to fetch tags",
        "error"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportTag = async (tagName: string) => {
    if (!tags.includes(tagName)) {
      const updatedTags = [...tags, tagName];
      
      await handleOperation(
        async () => {
          await chrome.storage.sync.set({ tags: updatedTags });
          setTags(updatedTags);
        },
        {
          successMessage: `Added tag: ${tagName}`,
          errorMessage: "Failed to import tag",
        }
      );
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