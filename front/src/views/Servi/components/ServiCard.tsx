import React from 'react';
import { Box, Typography, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Servi } from '../../../types';

interface Props {
  servi: Servi;
}
const ServiCard = (props: Props) => {
  const classes = useStyles();
  const { servi } = props;

  return (
    <Box>
      <Typography>{servi.name}</Typography>
      <Typography>{servi.description}</Typography>
      <Typography>Start tid: {servi.startTime}</Typography>
      <Typography>Slut tid: {servi.endTime}</Typography>
      <Typography>Kugghjul: {servi.points}</Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default ServiCard;
