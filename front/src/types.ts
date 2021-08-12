export interface AuthState {
  userIsAutharized: boolean | null;
  userInfo?: User;
}

export interface CategoryState {
  isFetched: boolean;
  categories: Category[]
}

export interface EventState {
  isFetched: boolean;
  events: Event[]
}

export enum userRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
}

export interface User {
  token: string;
  id?: number;
  role: userRole;
  email: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  events: Array<DoneEvent>;
  capWithTF: boolean;
}

export interface NewUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  capWithTF: boolean;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  startTime: luxon.DateTime;
  endTime: luxon.DateTime;
  points?: number;
  userLimit?: number;
  categoryId: number;
  mandatory: boolean;
}

export type NewEvent = Omit<Event, 'id'>

export interface Category {
  id: number;
  name: string;
  description: string;
  minPoints: number | null;
  events: Event[]
}

export enum EventStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface DoneEvent {
  id: number;
  status: EventStatus;
  timeOfSignup: Date;
  timeOfCompletion: Date;
  eventID: number;
  userID: number;
}

export enum Routes {
  ROOT = '/',
  LOGIN = '/login',
  SIGNUP = '/signup',
  CATEGORY = '/kategori',
  SPECIFIC_CATEGORY = '/kategori/:categoryId',
  ADMIN = '/admin'
 }
