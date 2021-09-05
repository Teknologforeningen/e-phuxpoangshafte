import { Box, Button, Link, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import TFlogoSVG from '../styles/img/TFlogo';
import { Routes } from '../types';

const StartPage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <TFlogoSVG className={classes.logo} />
      <Typography className={classes.title}>
        Teknologföreningens phuxpoängskort
      </Typography>
      <Typography className={classes.subtitle}>Phux 2021</Typography>
      <Box className={classes.buttonWrapper}>
        {/* TODO: Remove links/make nicer looking */}
        <Link href={Routes.LOGIN} variant={'inherit'} underline={'none'}>
          <Button
            variant={'contained'}
            size={'large'}
            className={classes.buttons}
          >
            Logga in
          </Button>
        </Link>
        <Link href={Routes.SIGNUP} variant={'inherit'} underline={'none'}>
          <Button
            variant={'contained'}
            size={'large'}
            className={classes.buttons}
          >
            Registera dig
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    title: {
      textAlign: 'center',
      fontSize: '200%',
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '150%',
    },
    buttonWrapper: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    buttons: {
      fontSize: 'large',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.secondary.main,
    },
    logo: {
      fill: theme.palette.secondary.main,
    },
  }),
);

export default StartPage;
