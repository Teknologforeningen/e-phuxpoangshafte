export enum userRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
}

export interface User {
  id?: number;
  role: userRole;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  events: Array<Event['id']>;
  capWithTF: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  minPoints: number | null;
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

export interface Servi {
  id: number;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  points: number;
  userLimit?: number;
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

export interface DoneServi {
  id: number;
  userID: number;
  serviID: number;
  status: EventStatus;
  timeOfSignup: Date;
  timeOfCompletion: Date;
}
