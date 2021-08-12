import axios from 'axios';
import { NewEventAttributes } from '../views/Admin/components/NewEventForm';

import { Event, NewEvent } from '../types';
const baseUrl = '/api/events';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get(baseUrl);
  return response.data as Event[];
};

export const addEvent = async (
  eventInfo: NewEventAttributes,
  token: string,
): Promise<Event> => {
  /*const headers = {
    'Authorization': `Bearer ${token}` 
  }*/
  const newEvent: NewEvent = {
    name: eventInfo.name,
    description: eventInfo.description,
    startTime: eventInfo.startTime,
    endTime: eventInfo.endTime,
    points: eventInfo.points,
    userLimit: eventInfo.userLimit,
    categoryId: eventInfo.categoryId as number,
    mandatory: eventInfo.mandatory,
  };

  const response = await axios.post(
    baseUrl,
    newEvent /*, {headers: {...headers}}*/,
  );
  return response.data as Event;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllEvents,
};
