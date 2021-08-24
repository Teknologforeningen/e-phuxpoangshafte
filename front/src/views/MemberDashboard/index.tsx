import React from 'react';
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
} from '../../types';
import CategoryProgress from './components/CategoryProgress';
import _ from 'lodash';
import { Typography } from '@material-ui/core';

interface Props {
  email: string;
}

const MemberDashboard = (props: Props) => {
  const auth: AuthState = useSelector(AuthSelectors.auth);
  const categoriesState: CategoryState = useSelector(
    CategorySelectors.allCategories,
  );
  const categories = categoriesState.categories;
  const eventState: EventState = useSelector(EventSelectors.allEvents);
  const events = eventState.events;
  if (!auth || !categories || !events) {
    return <></>;
  }
  const ListOfCategoryProgress: JSX.Element[] =
    categoriesState.categories !== undefined
      ? categoriesState.categories.map(cat => (
          <CategoryProgress category={cat} progress={50} />
        ))
      : [<></>];
  const ListOfDoneEvents = auth.userInfo?.events
    .map((event: DoneEvent) => event.eventID)
    .map((eventID: Number) =>
      eventState.events.find((e: Event) => eventID === e.id),
    );

  const EventsGroupedByCategoryId = _.groupBy(events, 'categoryId');
  const pointsPerCategori = _.mapValues(EventsGroupedByCategoryId, eventArray =>
    eventArray.reduce(
      (totalPoints, event) => totalPoints + (event.points ? event.points : 0),
      0,
    ),
  );

  console.log(ListOfDoneEvents);

  return (
    <div>
      <Typography variant={'h4'}>
        Hello {auth.userInfo?.firstName} {auth.userInfo?.lastName}
      </Typography>

      <Typography variant={'h5'}>Kategorier:</Typography>
      {ListOfCategoryProgress}
    </div>
  );
};

export default MemberDashboard;
