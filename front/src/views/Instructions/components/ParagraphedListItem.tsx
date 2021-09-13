import { ListItem, ListItemText, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';

interface props {
  index: number;
  content: string;
}

const ParagraphedListItem = ({ index, content }: props) => {
  const classes = useStyles();
  return (
    <ListItem key={index} >
      <ListItemText primary={`§ ${index}`} secondary={content}></ListItemText>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default ParagraphedListItem;
