import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { Theme, Box, Chip } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import * as UserService from '../../../services/UserServices';
import * as EventSelector from '../../../selectors/EventSelectors';
import { User, DoneEvent, Event, EventStatus, UserRole } from '../../../types';
import AdminLayout from './AdminLayout';

const StatusRenderer = (params: ICellRendererParams) => {
  const status = params.value;
  switch (status) {
    case EventStatus.PENDING:
    case EventStatus.CONFIRMED:
      return (
        <Chip
          label="Väntar"
          size="small"
          sx={{
            bgcolor: 'rgba(237, 137, 54, 0.1)',
            color: '#C05621',
            fontWeight: 700,
            borderRadius: '8px',
            fontSize: '0.75rem',
          }}
        />
      );
    case EventStatus.COMPLETED:
      return (
        <Chip
          label="Gjord"
          size="small"
          sx={{
            bgcolor: 'rgba(72, 187, 120, 0.1)',
            color: '#2F855A',
            fontWeight: 700,
            borderRadius: '8px',
            fontSize: '0.75rem',
          }}
        />
      );
    case EventStatus.CANCELLED:
      return (
        <Chip
          label="Förkastad"
          size="small"
          sx={{
            bgcolor: 'rgba(245, 101, 101, 0.1)',
            color: '#C53030',
            fontWeight: 700,
            borderRadius: '8px',
            fontSize: '0.75rem',
          }}
        />
      );
    case 'NOSTATUS':
    default:
      return (
        <Chip
          label="Ogjort"
          size="small"
          sx={{
            bgcolor: '#f8fafc',
            color: '#718096',
            fontWeight: 700,
            borderRadius: '8px',
            fontSize: '0.75rem',
            border: '1px solid #edf2f7',
          }}
        />
      );
  }
};

const UserTable = () => {
  const classes = useStyles();
  const events: Event[] = useSelector(EventSelector.allEventsOrderedByStartTime);
  const [users, setUsers] = useState<User[] | undefined>();

  useEffect(() => {
    const getUsers = async () => {
      const response = await UserService.getAllUsers();
      const users = orderBy(response, ['lastName', 'firstName'], ['asc', 'asc']);
      setUsers(users);
    };
    getUsers();
  }, []);

  const usersNoAdmins = useMemo(() => {
    return users ? users.filter((user: User) => user.role !== UserRole.ADMIN) : undefined;
  }, [users]);

  const rowData = useMemo(() => {
    if (!usersNoAdmins || !events) return [];
    
    return usersNoAdmins.map((user: User) => {
      const userCompletedEventStatuses: { [eventId: string]: string } = {};
      events.forEach((event) => {
        userCompletedEventStatuses['col' + event.id] = 
          user.events.find((de: DoneEvent) => de.eventID === event.id)?.status || 'NOSTATUS';
      });

      return {
        id: user.id,
        name: user.firstName + ' ' + user.lastName,
        fieldOfStudy: user.fieldOfStudy,
        ...userCompletedEventStatuses,
      };
    });
  }, [usersNoAdmins, events]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const defaultCols: ColDef[] = [
      {
        field: 'name',
        headerName: 'Namn',
        pinned: 'left',
        lockPinned: true,
        width: 180,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'fieldOfStudy',
        headerName: 'Studieriktning',
        width: 160,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      }
    ];

    const eventCols: ColDef[] = events ? events.map((event: Event) => ({
      field: 'col' + event.id,
      headerName: event.name,
      width: 150,
      cellRenderer: StatusRenderer,
      filter: true,
      headerTooltip: event.description || event.name
    })) : [];

    return [...defaultCols, ...eventCols];
  }, [events]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      sortable: true,
    };
  }, []);

  return (
    <AdminLayout 
      title="Användartabell" 
      description="Detaljerad översikt av alla användare och deras enskilda punktstatus."
    >
      <Box className={classes.agGridContainer}>
        <div className="ag-theme-material" style={{ height: '700px', width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
          />
        </div>
      </Box>
    </AdminLayout>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    agGridContainer: {
      width: '100%',
      marginTop: theme.spacing(2),
      '& .ag-theme-material': {
        '--ag-material-primary-color': theme.palette.primary.main,
      }
    },
  }),
);

export default UserTable;
