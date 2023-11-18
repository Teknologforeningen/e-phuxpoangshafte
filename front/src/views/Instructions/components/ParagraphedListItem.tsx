import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

interface props {
  index: number;
  content: string;
}

const ParagraphedListItem = ({ index, content }: props) => {
  return (
    <ListItem key={`${index}+name`}>
      <ListItemText primary={`§ ${index}`} secondary={content}></ListItemText>
    </ListItem>
  );
};

export default ParagraphedListItem;
