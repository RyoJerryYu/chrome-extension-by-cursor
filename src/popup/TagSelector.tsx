import React from 'react';
import { 
  Box, 
  Chip, 
  Typography, 
  Button,
  Stack,
  Paper 
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { memoService } from "../services/memoService";

interface ServerTag {
  name: string;
  count: number;
}

interface TagSelectorProps {
  onSelectTag: (tag: string) => void;
}

export function TagSelector({ onSelectTag }: TagSelectorProps) {
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
          <Button
            size="small"
            onClick={handleFetchTags}
            disabled={isFetchingTags}
          >
            {isFetchingTags ? "Refreshing..." : "Fetch Server Tags"}
          </Button>
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
              onClick={() => onSelectTag(tag.replace('#', ''))}
              variant="outlined"
              color="primary"
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
                onClick={() => onSelectTag(name.replace('#', ''))}
                variant="outlined"
                sx={{ opacity: isLocal ? 0.6 : 1 }}
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