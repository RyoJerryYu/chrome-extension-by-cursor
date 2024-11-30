import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';

interface InsertTaskButtonProps {
  textFieldRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  setContent: (content: string) => void;
  disabled?: boolean;
}

export function InsertTaskButton({ 
  textFieldRef, 
  content, 
  setContent, 
  disabled = false 
}: InsertTaskButtonProps) {
  const handleClick = () => {
    const textField = textFieldRef.current;
    if (textField) {
      const startAt = textField.selectionStart;
      let start = content.substring(0, startAt).trimEnd();
      let end = content.substring(startAt).trimStart();
      
      if (start.length !== 0 && !start.endsWith('\n')) {
        start += '\n';
      }
      
      if (end.length !== 0 && !end.startsWith('\n')) {
        end = '\n' + end;
      }
      
      const taskText = "- [ ] ";
      const newContent = start + taskText + end;
      const cursorAt = start.length + taskText.length;
      
      setContent(newContent);
      setTimeout(() => {
        textField.focus();
        textField.setSelectionRange(cursorAt, cursorAt);
      }, 0);
    } else {
      setContent(content + "- [ ] ");
    }
  };

  return (
    <Tooltip title="Add Task Checkbox">
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        color="primary"
        size="small"
      >
        <AddTaskIcon />
      </IconButton>
    </Tooltip>
  );
} 