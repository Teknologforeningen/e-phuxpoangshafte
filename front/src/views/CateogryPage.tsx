import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import * as CategorySelector from '../selectors/CategorySelectors'
import * as EventSelector from '../selectors/EventSelectors'
import { Category, Event, EventState } from '../types';
import EventInCategory from '../components/EventInCategory'

const CategoryPage = ({categoryID}: {categoryID: string}) => {
  const category: Category = useSelector(state =>  CategorySelector.categoryById(state, categoryID))
  const events: Event[] = useSelector(EventSelector.allEvents).events
  if(!category || !events){
    return <React.Fragment></React.Fragment>
  }
  const filteredEvents = events.filter( e => e.categoryId === Number(categoryID) )
  const ListOfEvents = filteredEvents.map((event:Event) => <EventInCategory key={event.id} event={event}/>)
  return (
    <Box>
      <h2>{category.name}</h2>
      <i>{category.description}</i>
      <br/>
      {category.minPoints ? "Minimum poäng:" + category.minPoints : ""}
      <br/>
      {ListOfEvents}
    </Box>
  )
}

export default CategoryPage