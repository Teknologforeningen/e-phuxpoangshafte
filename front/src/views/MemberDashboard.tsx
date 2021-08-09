import React from 'react';
import { useSelector } from 'react-redux';
import * as AuthSelectors from '../selectors/AuthSelectors';
import * as CategorySelectors from '../selectors/CategorySelectors';
import * as EventSelectors from '../selectors/EventSelectors';
import {
  AuthState,
  CategoryState,
  DoneEvent,
  EventState,
  Event,
} from '../types';

interface Props {
  email: string;
}

const MemberDashboard = (props: Props) => {
  const auth: AuthState = useSelector(AuthSelectors.auth);
  const categoriesState: CategoryState = useSelector(
    CategorySelectors.allCategories,
  );
  const eventState: EventState = useSelector(EventSelectors.allEvents);
  const ListOfCategories =
    categoriesState.categories !== undefined
      ? categoriesState.categories.map(cat => <p>{cat.name}</p>)
      : '';
  const ListOfDoneEvents = auth.userInfo?.events
    .map((event: DoneEvent) => event.eventID)
    .map((eventID: Number) =>
      eventState.events.find((e: Event) => eventID === e.id),
    );
  return (
    <div>
      <p>
        Hello {auth.userInfo?.firstName} {auth.userInfo?.lastName}
      </p>
      <h2>Kategorier:</h2>
      {ListOfCategories}
    </div>
  );
};

export default MemberDashboard;
