import React from 'react';
import { 
  Box, 
  Chip, 
  Typography, 
  Stack,
  Paper,
  IconButton,
  Tooltip 
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import RefreshIcon from '@mui/icons-material/Refresh';
import { memoService } from "../services/memoService";

interface ServerTag {
  name: string;
  count: number;
}

interface TagSelectorProps {
  textFieldRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  setContent: (content: string) => void;
  disabled?: boolean;
}

export function TagSelector({ 
  textFieldRef,
  content,
  setContent,
  disabled = false 
}: TagSelectorProps) {
  const [localTags, setLocalTags] = React.useState<string[]>([]);
  const [serverTags, setServerTags] = React.useState<ServerTag[]>([]);
  const [isFetchingTags, setIsFetchingTags] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    chrome.storage.sync.get(['tags'], (result) => {
      setLocalTags(result.tags || []);
    });
  }, []);

  const handleFetchTags = async () => {
    setIsFetchingTags(true);
    setError(null);
    try {
      const tagAmounts = await memoService.listTags();
      const tagList = Object.entries(tagAmounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setServerTags(tagList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tags");
    } finally {
      setIsFetchingTags(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    const inputTag = "#" + tag;
    const textField = textFieldRef.current;
    
    if (textField) {
      const startAt = textField.selectionStart;
      const endAt = textField.selectionEnd;
      let start = content.substring(0, startAt).trimEnd();
      if (start.length !== 0) {
        start += " ";
      }
      let end = content.substring(endAt).trimStart();
      if (end.length !== 0) {
        end = " " + end;
      }
      const newContent = start + inputTag + end;
      const cursorAt = start.length + inputTag.length;
      setContent(newContent);
      setTimeout(() => {
        textField.focus();
        textField.setSelectionRange(cursorAt, cursorAt);
      }, 0);
    } else {
      setContent(content + inputTag);
    }
  };

  if (localTags.length === 0 && serverTags.length === 0 && !isFetchingTags) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Tags
          </Typography>
          <Tooltip title={isFetchingTags ? "Refreshing..." : "Fetch Server Tags"}>
            <span>
              <IconButton
                size="small"
                onClick={handleFetchTags}
                disabled={isFetchingTags || disabled}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5,
          maxHeight: 150,
          overflowY: 'auto',
          p: 0.5,
          bgcolor: 'grey.50',
          borderRadius: 1
        }}>
          {/* Local Tags */}
          {localTags.map((tag) => (
            <Chip
              key={`local-${tag}`}
              label={tag}
              size="small"
              icon={<TagIcon />}
              onClick={() => handleTagSelect(tag.replace('#', ''))}
              variant="outlined"
              color="primary"
              disabled={disabled}
            />
          ))}
          {/* Server Tags */}
          {serverTags.map(({ name, count }) => {
            const isLocal = localTags.includes(name);
            return (
              <Chip
                key={`server-${name}`}
                label={`${name} (${count})`}
                size="small"
                icon={<TagIcon />}
                onClick={() => handleTagSelect(name.replace('#', ''))}
                variant="outlined"
                sx={{ opacity: isLocal ? 0.6 : 1 }}
                disabled={disabled}
              />
            );
          })}
        </Box>
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
} 