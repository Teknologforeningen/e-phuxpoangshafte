import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as AuthSelectors from '../../selectors/AuthSelectors';
import * as CategorySelectors from '../../selectors/CategorySelectors';
import * as EventSelectors from '../../selectors/EventSelectors';
import {
  AuthState,
  CategoryState,
  DoneEvent,
  EventState,
  Event,
  EventStatus,
  Category,
} from '../../types';
import CategoryProgress from './components/CategoryProgress';
import { mapUserDoneEventsToEvents } from '../../utils/HelperFunctions';
import _ from 'lodash';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  List,
  ListItem,
  Theme,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

const MemberDashboard = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const auth: AuthState = useSelector(AuthSelectors.auth);
  const categoriesState: CategoryState = useSelector(
    CategorySelectors.allCategories,
  );
  const nonEmptyCategories = categoriesState.categories.filter(
    (category: Category) => category.events.length > 0,
  );
  const eventState: EventState = useSelector(EventSelectors.allEvents);
  const events = eventState.events;
  if (!auth || !auth.userInfo || !nonEmptyCategories || !events) {
    return <></>;
  }

  const eventsGroupedByCategoryId = _.groupBy(events, 'categoryId');
  const pointsPerCategori = _.mapValues(eventsGroupedByCategoryId, eventArray =>
    eventArray.reduce(
      (totalPoints, event) => totalPoints + (event.points ? event.points : 0),
      0,
    ),
  );

  const listOfCompletedEvents = auth.userInfo.events.filter(
    (event: DoneEvent) => event.status === EventStatus.COMPLETED,
  );

  const listOfCompletedAndMappedEvents = listOfCompletedEvents
    .map((event: DoneEvent) => event.eventID)
    .map((eventID: Number) =>
      eventState.events.find((e: Event) => eventID === e.id),
    );

  const completedEventsGroupedByCategoryId = _.groupBy(
    listOfCompletedAndMappedEvents,
    'categoryId',
  );

  const completedPointsPerCategori = _.mapValues(
    completedEventsGroupedByCategoryId,
    eventArray =>
      eventArray.reduce(
        (totalPoints, event) =>
          totalPoints + (event ? (event.points ? event.points : 0) : 0),
        0,
      ),
  );

  const completionAmountPerCategori: { [categoryId: number]: number } =
    Object.entries(pointsPerCategori).reduce(
      (prev, [categoryId, categoryPoints]) => {
        const newReturn = {
          ...prev,
          [categoryId]:
            categoryPoints > 0
              ? completedPointsPerCategori[categoryId]
                ? Math.min(
                    completedPointsPerCategori[categoryId] / categoryPoints,
                    1,
                  ) * 100
                : 0
              : 0,
        };
        return newReturn;
      },
      {},
    );

  const ListOfCategoryProgress: JSX.Element[] = nonEmptyCategories
    ? nonEmptyCategories.map(category => (
        <CategoryProgress
          key={category.id}
          category={category}
          progress={completionAmountPerCategori[category.id]}
          currentAmount={
            completedPointsPerCategori[category.id]
              ? completedPointsPerCategori[category.id]
              : 0
          }
          requiredAmount={category.minPoints ? category.minPoints : 0}
        />
      ))
    : [<></>];

  const pendingEvents = auth.userInfo.events.filter(
    (doneEvent: DoneEvent) => doneEvent.status === EventStatus.PENDING,
  );
  const pendingAmount = pendingEvents.length;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const listOfPendingEvents = mapUserDoneEventsToEvents(
    pendingEvents,
    events,
  ).map((event: Event) => <ListItem key={event.id}>{event.name}</ListItem>);

  return (
    <Box maxWidth={600}>
      {pendingAmount > 0 ? (
        <Card variant={'outlined'} className={classes.cardLayout}>
          <CardActionArea onClick={handleExpandClick}>
            <CardContent>
              <Typography>
                Du har {pendingAmount} poäng som väntar på godkännande
              </Typography>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List>{listOfPendingEvents}</List>
              </Collapse>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
        <></>
      )}
      {ListOfCategoryProgress}
    </Box>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      cardLayout: {
        margin: theme.spacing(2, 0),
      },
    }),
  { index: 1 },
);

export default MemberDashboard;
