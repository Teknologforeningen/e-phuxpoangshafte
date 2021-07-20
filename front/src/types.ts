export interface AuthState {
  userIsAutharized: boolean;
  userInfo?: authDetails
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

export interface authDetails {
  token: string;
  id?: number;
  role: userRole;
  email: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  events: Array<DoneEvents>;
  capWithTF: boolean;
}


export interface Event {
  id: number;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  points?: number;
  userLimit?: number;
  categoryId: number;
  mandatory: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  minPoints: number | null;
}

export enum EventStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface DoneEvents {
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
  SPECIFIC_CATEGORY = '/kategori/:category',
 }
