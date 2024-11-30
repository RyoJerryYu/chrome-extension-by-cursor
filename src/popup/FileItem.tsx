import React, { useState, useEffect } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FileItemProps {
  file: File;
  onRemove: () => void;
}

export function FileItem({ file, onRemove }: FileItemProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <ListItem sx={{ py: 0 }}>
      <ListItemAvatar>
        {thumbnail ? (
          <Avatar
            variant="rounded"
            src={thumbnail}
            sx={{
              width: 40,
              height: 40,
              '& img': { objectFit: 'cover' }
            }}
          />
        ) : (
          <Avatar variant="rounded">
            <InsertDriveFileIcon />
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText 
        primary={file.name}
        secondary={`${(file.size / 1024).toFixed(1)} KB`}
        primaryTypographyProps={{ variant: 'body2' }}
        secondaryTypographyProps={{ variant: 'caption' }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          size="small"
          onClick={onRemove}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
} 