import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

import { User, DoneEvent, Event, EventStatus } from '../../types';

import * as UserService from '../../services/UserServices';
import * as EventSelector from '../../selectors/EventSelectors';
import {
  ErrorNotification,
  InfoNotification,
  SuccessNotification,
} from '../../components/Notifications';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import AdminLayout from './components/AdminLayout';

interface PendingRequest {
  id: string; // userId_eventId
  user: User;
  event: Event;
  doneEvent: DoneEvent;
}

const RequestPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshSeed, setRefreshSeed] = useState(0); // Quick way to trigger refetches
  const events: Event[] = useSelector(
    EventSelector.allEventsOrderedByStartTime,
  );

  useEffect(() => {
    const getUsers = async () => {
      const response = await UserService.getAllUsers();
      setUsers(response);
    };
    getUsers();
  }, [refreshSeed]);

  const rowData = useMemo(() => {
    if (!users || !events) return [];

    let pending: PendingRequest[] = [];
    users.forEach(user => {
      user.events
        .filter(e => e.status === EventStatus.PENDING)
        .forEach(doneEvent => {
          const matchingEvent = events.find(ev => ev.id === doneEvent.eventID);
          if (matchingEvent) {
            pending.push({
              id: `${user.id}_${matchingEvent.id}`,
              user,
              event: matchingEvent,
              doneEvent,
            });
          }
        });
    });

    // Order by signup time descending (newest requests first)
    return orderBy(pending, ['doneEvent.timeOfSignup'], ['desc']);
  }, [users, events]);

  const handleApprove = useCallback(async (user: User, event: Event) => {
    try {
      await UserService.updateUserEventStatus(
        user,
        event.id,
        EventStatus.COMPLETED,
      );
      SuccessNotification(
        `${event.name} för ${user.firstName} ${user.lastName} har godkänts!`,
      );
      setRefreshSeed(s => s + 1);
    } catch (error) {
      console.error({
        error,
        message: 'acceptPoint function could not be completed',
      });
      ErrorNotification(
        `${event.name} för ${user.firstName} ${user.lastName} kunde inte godkännas!`,
      );
    }
  }, []);

  const handleDecline = useCallback(async (user: User, event: Event) => {
    try {
      await UserService.updateUserEventStatus(
        user,
        event.id,
        EventStatus.CANCELLED,
      );
      InfoNotification(
        `${event.name} för ${user.firstName} ${user.lastName} har förkastats`,
      );
      setRefreshSeed(s => s + 1);
    } catch (error) {
      console.error({
        error,
        message: 'declinePoint function could not be completed',
      });
      ErrorNotification(
        `${event.name} för ${user.firstName} ${user.lastName} kunde inte förkastas!`,
      );
    }
  }, []);

  const ActionsRenderer = useCallback(
    (params: ICellRendererParams) => {
      const req: PendingRequest = params.data;
      if (!req) return null;

      return (
        <Box display="flex" gap={1} alignItems="center" height="100%">
          <Tooltip title="Godkänn poäng">
            <IconButton
              color="success"
              size="small"
              onClick={() => handleApprove(req.user, req.event)}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Förkasta poäng">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDecline(req.user, req.event)}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
    [handleApprove, handleDecline],
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'user.firstName',
        headerName: 'Användare',
        valueGetter: p => `${p.data.user.firstName} ${p.data.user.lastName}`,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        minWidth: 200,
      },
      {
        field: 'event.name',
        headerName: 'Evenemang/Poäng',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        minWidth: 200,
      },
      {
        field: 'event.points',
        headerName: 'Poäng',
        width: 100,
      },
      {
        field: 'doneEvent.timeOfSignup',
        headerName: 'Ansökt den',
        valueFormatter: p =>
          new Date(p.value).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        minWidth: 180,
      },
      {
        headerName: 'Åtgärder',
        cellRenderer: ActionsRenderer,
        pinned: 'right',
        lockPinned: true,
        width: 120,
        suppressMenu: true,
        sortable: false,
      },
    ],
    [ActionsRenderer],
  );

  if (!users) return null;

  return (
    <AdminLayout
      title="Ansökta underskrifter"
      description="Hantera och godkänn poängförfrågningar snabbt genom listan nedan."
    >
      <Box width="100%" mt={2}>
        <div
          className="ag-theme-material"
          style={{ height: '700px', width: '100%' }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            headerHeight={48}
            groupHeaderHeight={48}
            defaultColDef={{ resizable: true, sortable: true }}
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            rowHeight={52}
          />
        </div>
      </Box>
    </AdminLayout>
  );
};

export default RequestPage;
