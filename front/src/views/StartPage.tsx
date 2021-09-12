import React from 'react';
import { Box, Button, Link, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import TFlogoSVG from '../styles/img/TFlogo';
import { Routes } from '../types';

const StartPage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <TFlogoSVG className={classes.logo} />
      <Typography textAlign={'center'} variant={'h4'}>
        Teknologföreningens phuxpoängskort
      </Typography>
      <Typography textAlign={'center'} variant={'h6'}>
        Phux 2021
      </Typography>
      <Box className={classes.buttonWrapper}>
        <Link href={Routes.SIGNUP} variant={'inherit'} underline={'none'}>
          <Button
            variant={'outlined'}
            size={'large'}
            className={classes.outLinedButton}
          >
            Registera
          </Button>
        </Link>
        <Link href={Routes.LOGIN} variant={'inherit'} underline={'none'}>
          <Button
            variant={'contained'}
            size={'large'}
            className={classes.buttons}
          >
            Logga in
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      },
      buttonWrapper: {
        marginTop: theme.spacing(2),
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      buttons: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
        maxWidth: '200px',
        padding: theme.spacing(2, 5),
        borderRadius: 0,
      },
      outLinedButton: {
        color: theme.palette.secondary.main,
        border: `1px solid ${theme.palette.secondary.main}`,
        width: '100%',
        maxWidth: '200px',
        padding: theme.spacing(2, 5),
        borderRadius: 0,
      },
      logo: {
        fill: theme.palette.secondary.main,
        width: '60%',
        maxWidth: 400,
        maxHeight: 400,
        margin: '0 auto',
      },
    }),
  { index: 1 },
);

export default StartPage;
