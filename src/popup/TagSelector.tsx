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

interface TagSelectorProps {
  onSelectTag: (tag: string) => void;
}

export function TagSelector({ onSelectTag }: TagSelectorProps) {
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    chrome.storage.sync.get(['tags'], (result) => {
      setTags(result.tags || []);
    });
  }, []);

  if (tags.length === 0) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Saved Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              icon={<TagIcon />}
              onClick={() => onSelectTag(tag)}
              variant="outlined"
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
} 