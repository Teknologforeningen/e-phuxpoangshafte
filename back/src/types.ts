export enum userRole {
  Basic = 'basic',
  Admin = 'admin'
}

export interface User {
  id?: number,
  role: userRole,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  fieldOfStudy: string,
  events: Array<Event['id']>,
  capWithTF: boolean
}

export interface Category {
  id: number
  name: string
  description: string
  minPoints: number | null
}

export interface Event {
  id: number
  name: string
  description: string
  startTime: Date
  endTime: Date
  points?: number
  userLimit?: number
  categoryId: number
  mandatory: boolean
}

export enum EventStatus{
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed'
}

export interface DoneEvents {
  id: number
  status: EventStatus
  timeOfSignup: Date
  timeOfCompletion: Date
  eventID: number
  userID: number
}
