import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import * as CategorySelector from '../selectors/CategorySelectors'
import * as EventSelector from '../selectors/EventSelectors'
import * as AuthSelector from '../selectors/AuthSelectors'
import { authDetails, AuthState, Category, DoneEvents, Event } from '../types';
import EventInCategory from '../components/EventInCategory'

const CategoryPage = ({categoryID}: {categoryID: string}) => {
  const category: Category = useSelector(state =>  CategorySelector.categoryById(state, categoryID))
  const events: Event[] = useSelector(EventSelector.allEvents).events
  const userInfo: authDetails = useSelector(AuthSelector.auth).userInfo!

  if(!category || !events){
    return <React.Fragment></React.Fragment>
  }
  const eventsInCategory = events.filter( e => e.categoryId === Number(categoryID))
  const userCompltedEventIDs = userInfo.events.map((event:DoneEvents) => event.eventID)
  const completedEventsInCategory = eventsInCategory.filter((event: Event) => {
    console.log("EventID:",event.id)
    return userCompltedEventIDs.includes(event.id)})
  const completedPointsInCategory = completedEventsInCategory.map((event: Event) => event.points).reduce((acc: number, cur: number|undefined) => cur ? acc + cur : acc, 0)
  const ListOfEvents = eventsInCategory.map((event:Event) => <EventInCategory key={event.id} event={event}/>)
  console.log(userCompltedEventIDs)
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