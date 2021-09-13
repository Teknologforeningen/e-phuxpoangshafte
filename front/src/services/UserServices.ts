import axios from 'axios';
import { User, EventStatus, NewUser, userRole, DoneEvent } from '../types';
const baseUrl = '/api/users';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(baseUrl);
  return response.data as User[];
};

export const getSingleUserInfo = async (userId: number): Promise<User> => {
  const url = `${baseUrl}/${userId}`;
  const response = await axios.get(url);
  return response.data as User;
};

export const addUser = async (userInfo: NewUser) => {
  const userToAdd = {
    role: userRole.BASIC,
    password: userInfo.password,
    email: userInfo.email,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    fieldOfStudy: userInfo.fieldOfStudy,
    capWithTF: userInfo.capWithTF,
  };
  const response = await axios.post(baseUrl, userToAdd);
  return response.data;
};

export const updateUser = async (userInfo: NewUser, userID: number) => {
  const userToUpdate = {
    password: userInfo.password,
    email: userInfo.email,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    fieldOfStudy: userInfo.fieldOfStudy,
    capWithTF: userInfo.capWithTF,
  };
  const url = `${baseUrl}/${userID}`;
  const response = await axios.put(url, userToUpdate);
  return response.data;
};

export const addDoneEvent = async (userID: number, eventID: number) => {
  const url = `${baseUrl}/${userID}/done_events/${eventID}`;
  const response = await axios.post(url, null);
  return response.data;
};

export const updateUserEventStatus = async (
  user: User,
  eventID: number,
  newStatus: EventStatus,
) => {
  const url = `${baseUrl}/${user.id}/done_events/${eventID}`;
  const status = { status: newStatus };
  const response = await axios.put(url, status);
  return response.data as DoneEvent;
};
