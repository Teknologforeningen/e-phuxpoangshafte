import axios from 'axios';
import { Servi, NewServi } from '../types';
import { EditedServiAttributes } from '../views/Admin/components/EditServiForm';
import { NewServiAttributes } from '../views/Admin/components/NewServiForm';
const baseUrl = '/api/servi';

export const getAllServis = async (): Promise<Servi[]> => {
  const response = await axios.get(baseUrl);
  return response.data as Servi[];
};

export const addServi = async (
  serviInfo: NewServiAttributes,
): Promise<Servi> => {
  const newServi: NewServi = {
    name: serviInfo.name,
    description: serviInfo.description,
    startTime: serviInfo.startTime,
    endTime: serviInfo.endTime,
    points: serviInfo.points,
    userLimit: serviInfo.userLimit !== 0 ? serviInfo.userLimit : undefined,
  };

  const response = await axios.post(baseUrl, newServi);
  return response.data as Servi;
};

export const editServi = async (
  serviInfo: EditedServiAttributes,
): Promise<Servi> => {
  const updatedServi: NewServi = {
    name: serviInfo.name,
    description: serviInfo.description,
    startTime: serviInfo.startTime,
    endTime: serviInfo.endTime,
    points: serviInfo.points,
    userLimit: serviInfo.userLimit,
  };
  const url = `${baseUrl}/${serviInfo.serviId}`;
  const response = await axios.put(url, updatedServi);
  return response.data as Servi;
};
