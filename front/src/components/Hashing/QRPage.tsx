import React, { useEffect, useState } from 'react';
import * as HashServices from '../../services/HashServices';
import * as EventSelectors from '../../selectors/EventSelectors';
import { QRCodeSVG } from 'qrcode.react';
import { useRouteMatch } from 'react-router-dom';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { Event, Routes } from '../../types';

interface RouteType {
  eventId: string;
}

const QRPage = () => {
  const [hash, setHash] = useState('');
  const classes = useStyles();

  const moreThan500px = useMediaQuery('(min-width:500px)');
  const QRCodeSize = moreThan500px ? 500 : 250;

  const match = useRouteMatch(`${Routes.EVENT_GENERATION}/:eventId`);
  const eventId = match ? Number((match.params as RouteType).eventId) : 1;

  const events = useSelector(EventSelectors.allEvents).events;
  const foundEvent = events.find((event: Event) => event.id === eventId);
  const eventName = foundEvent ? foundEvent.name : '';

  useEffect(() => {
    const getAndSetQRcode = async () => {
      const hash = await HashServices.getHash({ eventId });
      setHash(hash);
    };
    getAndSetQRcode();
  }, [eventId]);

  const env =
    process.env.NODE_ENV === 'development' ? 'development' : 'production';
  const domain = {
    development: 'http://localhost:3000',
    production: 'https://xn--pong-moa.tf.fi',
  };
  const QRUrl = `${domain[env]}/poang/validation/${hash}`;

  if (hash === '' || !hash) {
    return <></>;
  }
  return (
    <Box className={classes.verticalSpacer}>
      <Typography variant={'h3'} className={classes.center}>
        {eventName}
      </Typography>
      <QRCodeSVG value={QRUrl} size={QRCodeSize} className={classes.center} />
    </Box>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      verticalSpacer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      center: {
        alignSelf: 'center',
      },
    }),
  { index: 1 },
);

export default QRPage;
