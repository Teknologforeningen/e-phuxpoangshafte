import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import * as CategorySelector from '../selectors/CategorySelectors'
import * as EventSelector from '../selectors/EventSelectors'
import * as AuthSelector from '../selectors/AuthSelectors'
import { User, AuthState, Category, DoneEvent, Event, EventStatus } from '../types';
import EventInCategory from '../components/UI/EventInCategory'
import { ensure } from '../utils.ts/HelperFunctions';

const CategoryPage = ({categoryID}: {categoryID: string}) => {
  const category: Category = useSelector(state =>  CategorySelector.categoryById(state, categoryID))
  const events: Event[] = useSelector(EventSelector.allEvents).events
  const userInfo: User = useSelector(AuthSelector.auth).userInfo!

  if(!category || !events){
    return <React.Fragment></React.Fragment>
  }
  const eventsInCategory = events.filter( e => e.categoryId === Number(categoryID))
  const userCompletedEvents = userInfo.events.filter((event:DoneEvent) => event.status === EventStatus.COMPLETED)
  const completedEventsInCategory = userCompletedEvents.filter((event: DoneEvent) => {
    return eventsInCategory.map((event: Event) => event.id).includes(event.id)})
  const completedEventsInCategoryCastedToEvents = completedEventsInCategory.map((doneEvent: DoneEvent) => eventsInCategory.find((event: Event) => doneEvent.eventID === event.id))
  const completedPointsInCategory: number = completedEventsInCategoryCastedToEvents
    .map((event: Event |undefined) => event ? event.points : 0)
    .reduce((acc: number, cur: number|undefined) => cur ? acc + cur : acc, 0)
  const ListOfEvents = eventsInCategory.map((event:Event) => <EventInCategory key={event.id} event={event} complitionStatus={userCompletedEvents.find((doneEvent:DoneEvent) => doneEvent.eventID === event.id)?.status}/>)
  return (
    <Box>
      <h2>{category.name}</h2>
      <i>{category.description}</i>
      <br/>
      {category.minPoints ? "Poäng: " + completedPointsInCategory + "/" + category.minPoints : ""}
      <br/>
      {ListOfEvents}
    </Box>
  )
}

export default CategoryPage