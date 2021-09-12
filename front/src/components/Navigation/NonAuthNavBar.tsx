import { Box, Link, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import TFLogoSVG from '../../styles/img/TFlogo';
import { Routes } from '../../types';
import { navBarHeight } from './NavBar';

const NonAuthNavBar = () => {
  const classes = useStyles();
  return (
    <Box className={classes.bar}>
      <Link key={'start'} href={Routes.ROOT} variant={'inherit'}>
        <TFLogoSVG className={classes.logo} />
      </Link>
    </Box>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      bar: {
        justifyContent: 'flex-start',
      },
      logo: {
        justifyContent: '',
        height: navBarHeight,
        width: navBarHeight,
        fill: theme.palette.secondary.main,
      },
    }),
  { index: 1 },
);

export default NonAuthNavBar;
