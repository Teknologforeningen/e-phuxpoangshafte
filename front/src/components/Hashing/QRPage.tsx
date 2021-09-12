import React, { useEffect, useState } from 'react';
import * as HashServices from '../../services/HashServices';
import * as EventSelectors from '../../selectors/EventSelectors';
import QRCode from 'qrcode.react';
import { useRouteMatch } from 'react-router-dom';
import { Box, Theme, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
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

  const match = useRouteMatch(Routes.EVENT_GENERATION);
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

  const QRUrl = `http://localhost:3000/paong/validation/${hash}`;

  if (hash === '' || !hash) {
    return <></>;
  }
  return (
    <Box className={classes.verticalSpacer}>
      <Typography variant={'h3'} className={classes.center}>
        {eventName}
      </Typography>
      <QRCode value={QRUrl} size={QRCodeSize} className={classes.center} />
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) =>
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
);

export default QRPage;
