import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import * as UserService from '../../../services/UserServices';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as EventService from '../../../services/EventServices';
import { User, DoneEvent, Event, EventStatus, userRole } from '../../../types';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowsProp,
} from '@material-ui/data-grid';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const UserTable = () => {
  const classes = useStyles();
  const token = useSelector(AuthSelector.token);
  const [events, setEvents] = useState<Event[] | undefined>();
  const [users, setUsers] = useState<User[] | undefined>();
  useEffect(() => {
    const getEvents = async () => {
      const response = await EventService.getAllEvents();
      setEvents(response);
    };
    const getUsers = async () => {
      const response = await UserService.getAllUsers(token);
      setUsers(response);
    };
    getEvents();
    getUsers();
  }, [token]);

  const columns: GridColDef[] = events
    ? events.map((event: Event) => {
        return {
          field: 'col' + event.id,
          headerName: event.name,
          description: event.description,
          width: 150,
          valueFormatter: ({ value }) => ``,
        };
      })
    : [{ field: '', headerName: '' }];

  const usersNoAdmins = users
    ? users.filter((user: User) => user.role !== userRole.ADMIN)
    : undefined;

  const rows: GridRowsProp =
    usersNoAdmins && events
      ? usersNoAdmins.map((user: User) => {
          const userCompletedEventStatuses: {
            [eventId: string]: EventStatus | 'NOSTATUS';
          } = events.reduce((map, event) => {
            return {
              ...map,
              ['col' + event.id]:
                user.events.find((de: DoneEvent) => de.eventID === event.id)
                  ?.status || 'NOSTATUS',
            };
          }, {} as { [eventId: number]: EventStatus | 'NOSTATUS' });
          return {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            ...userCompletedEventStatuses,
          };
        })
      : [
          {
            id: 0,
          },
        ];

  const nameColumn: GridColDef = {
    field: 'name',
    headerName: 'Namn',
    description: 'Användarens hela namn',
    width: 150,
  };

  const columnsWithNames = [nameColumn, ...columns];

  const cellClassNames = (params: GridCellParams) => {
    if (params.field === 'name') {
      return '';
    } else {
      switch (params.value) {
        case EventStatus.PENDING || EventStatus.CONFIRMED:
          return 'PENDING';
        case EventStatus.COMPLETED:
          return 'COMPLETED';
        default:
          return 'NOSTATUS';
      }
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }} className={classes.DataGrid}>
      <div style={{ display: 'flex', height: '100%' }}>
        <DataGrid
          rows={[...rows]}
          columns={columnsWithNames}
          getCellClassName={cellClassNames}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 300,
    },
    redLabel: {
      color: theme.palette.secondary.main,
    },
    DataGrid: {
      '& .NOSTATUS': {
        backgroundColor: '#004777',
      },
      '& .PENDING': {
        backgroundColor: '#FF9F1C',
      },
      '& .COMPLETED': {
        backgroundColor: '#436436',
      },
    },
  }),
);

export default UserTable;
