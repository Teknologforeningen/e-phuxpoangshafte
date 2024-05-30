import axios from 'axios';
import { NewEventAttributes } from '../views/Admin/components/NewEventForm';
import { Event, NewEvent } from '../types';
import { EditedEventAttributes } from '../views/Admin/components/EditEventForm';
const baseUrl = '/api/events';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get(baseUrl);
  return response.data as Event[];
};

export const addEvent = async (
  eventInfo: NewEventAttributes,
): Promise<Event> => {
  const newEvent: NewEvent = {
    name: eventInfo.name,
    description: eventInfo.description,
    startTime: eventInfo.startTime,
    endTime: eventInfo.endTime,
    points: eventInfo.points !== 0 ? eventInfo.points : undefined,
    userLimit: eventInfo.userLimit !== 0 ? eventInfo.userLimit : undefined,
    categoryId: eventInfo.categoryId as number,
    mandatory: eventInfo.mandatory,
  };

  const response = await axios.post(baseUrl, newEvent);
  return response.data as Event;
};

export const editEvent = async (
  eventInfo: EditedEventAttributes,
): Promise<Event> => {
  const updatedEvent: NewEvent = {
    name: eventInfo.name,
    description: eventInfo.description,
    startTime: eventInfo.startTime,
    endTime: eventInfo.endTime,
    points: eventInfo.points,
    userLimit: eventInfo.userLimit,
    categoryId: eventInfo.categoryId as number,
    mandatory: eventInfo.mandatory,
  };
  const url = `${baseUrl}/${eventInfo.eventId}`;
  const response = await axios.put(url, updatedEvent);
  return response.data as Event;
};

export const removeEvent = async (
  eventInfo: EditedEventAttributes,
): Promise<void> => {
  const url = `${baseUrl}/${eventInfo.eventId}`;
  await axios.delete(url);
};
