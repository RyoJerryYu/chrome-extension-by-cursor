import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

interface InsertPageButtonProps {
  textFieldRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  setContent: (content: string) => void;
  disabled?: boolean;
}

export function InsertPageButton({ 
  textFieldRef, 
  content, 
  setContent, 
  disabled = false 
}: InsertPageButtonProps) {
  const handleClick = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url && tab.title) {
        const markdownLink = `[${tab.title}](${tab.url})`;
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
          const newContent = start + markdownLink + end;
          const cursorAt = start.length + markdownLink.length;
          setContent(newContent);
          setTimeout(() => {
            textField.focus();
            textField.setSelectionRange(cursorAt, cursorAt);
          }, 0);
        } else {
          setContent(content + markdownLink);
        }
      }
    } catch (err) {
      console.error('Failed to get current tab:', err);
    }
  };

  return (
    <Tooltip title="Insert Current Page">
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        color="primary"
        size="small"
      >
        <LinkIcon />
      </IconButton>
    </Tooltip>
  );
} 