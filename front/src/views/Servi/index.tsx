import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Servi } from '../../types';
import * as ServiSelectors from '../../selectors/ServiSelectors';
import ServiCard from './components/ServiCard';

interface Props {}
const SeviPage = (props: Props) => {
  const classes = useStyles();
  const servis = useSelector(ServiSelectors.allServis).servis;
  return (
    <Box>
      <h2>Servin</h2>
      {servis.map((servi: Servi) => (
        <ServiCard servi={servi} />
      ))}
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default SeviPage;
