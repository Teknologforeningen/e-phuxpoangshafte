import { Servi } from '../types';

export type ServiActions = InitServis | AddServi | EditServi;

interface InitServis {
  type: 'INIT_SERVIS';
  isFetched: boolean;
  servis: Servi[];
}

export const initServis = (servis: Servi[]): InitServis => {
  return {
    type: 'INIT_SERVIS',
    isFetched: true,
    servis,
  };
};

interface AddServi {
  type: 'ADD_SERVI';
  servi: Servi;
}

export const addServi = (servi: Servi): AddServi => {
  return {
    type: 'ADD_SERVI',
    servi,
  };
};

interface EditServi {
  type: 'EDIT_SERVI';
  servi: Servi;
}

export const editServi = (servi: Servi): EditServi => {
  return {
    type: 'EDIT_SERVI',
    servi,
  };
};
