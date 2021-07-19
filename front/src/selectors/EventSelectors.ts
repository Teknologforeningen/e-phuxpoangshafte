import { EventState, Event } from '../types';

export const allEvents = (state: any): EventState => state.events;

export const eventsByCategoryId= (state: any, categoryId: string): Event[] => state.events.filter((e: Event) => e.categoryId === Number(categoryId))
