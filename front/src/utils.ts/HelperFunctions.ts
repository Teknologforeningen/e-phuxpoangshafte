import { useSelector } from "react-redux";
import { User, DoneEvent, Event } from "../types";
import * as EventSelector from '../selectors/EventSelectors'

/**
 * 
 * @param argument The argument which type is to be ensured that it is not null or undefined
 * @param message Custom message to thorw in the error, defaults to 'Wrong type'
 * @returns The argument that is not undefined or null
 */
export function ensure<T>(argument: T | undefined | null, message: string = 'Wrong type'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}

/**
 * Takes a user and a array of events and returns a array of the events ids that user has completed.
 */
export const mapUserAndEventsToDoneEvents = (user: User, events: Event[]): number[] | undefined => {
  if(user !== undefined && user.events !== undefined) {
    const eventIDs = events.map( (e: Event) => e.id)
    return user.events.filter( (dv: DoneEvent) => eventIDs.includes(dv.eventID)).map((dv: DoneEvent) => dv.eventID)
  }
  else{
    return undefined
  }
}

export const mapUserDoneEventsToEvents = (doneEvents: DoneEvent[], allEvents: Event[]): Event[]=> {
  const eventIds = doneEvents.map((doneEvent: DoneEvent) => doneEvent.eventID)
  return allEvents.filter((event: Event)=> eventIds.includes(event.id))

}
/*export const mapUserCompletedEventsCustomObj = (user: authDetails, events: Event[], fieldsOfUser: string[], fieldsOfEvents: string[]): number[] | undefined => {
  const eventIDs = mapUserCompletedEvents(user,events)
  if(eventIDs !== undefined) {
  }
  else{
    return undefined
  }
}*/