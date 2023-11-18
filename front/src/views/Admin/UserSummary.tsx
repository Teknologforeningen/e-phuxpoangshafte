import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  DataGrid,
  GridRowParams,
  GridColDef,
  MuiEvent,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserServices';
import * as EventSelector from '../../selectors/EventSelectors';
import * as CategorySelector from '../../selectors/CategorySelectors';
import {
  Event,
  User,
  UserRole,
  EventStatus,
  Category,
  CombinedEvent,
} from '../../types';
import { groupBy, orderBy } from 'lodash';
import UserCard from './components/UserCard';

const UserSummary = () => {
  const classes = useStyles();
  const events: Event[] = useSelector(
    EventSelector.allEventsOrderedByStartTime,
  );
  const categories: Category[] = useSelector(
    CategorySelector.allCategoriesOrderedByNameAsc,
  );

  const [users, setUsers] = useState<User[] | undefined>();
  const [userToShow, setUserToShow] = useState<number | undefined>();
  useEffect(() => {
    const getUsers = async () => {
      const response = await UserService.getAllUsers();
      const users = orderBy(
        response,
        ['lastName', 'firstName'],
        ['asc', 'asc'],
      );
      setUsers(users);
    };
    getUsers();
  }, []);

  if (!events || !users || !categories) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  const openPersonCard = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent<Element, globalThis.Event>>,
  ) => {
    const userId = Number(params.row.id);
    setUserToShow(userId);
  };

  const usersNoAdmins = users.filter(
    (user: User) => user.role !== UserRole.ADMIN,
  );

  const getPointsByCategoryFromCompletedEvents = (
    completedEvents: CombinedEvent[],
  ) => {
    const completedEventsGroupedByCategoryId = groupBy(
      completedEvents,
      'categoryId',
    );
    const pointsByCategoryId = Object.entries(
      completedEventsGroupedByCategoryId,
    ).map(([categoryId, events]) => {
      const sumOfEventPoints = events.reduce(
        (a, b) => (b.points ? a + b.points : a),
        0,
      );
      return { categoryId: Number(categoryId), points: sumOfEventPoints };
    });
    return pointsByCategoryId;
  };

  const usersWithCompletedPoints = usersNoAdmins.map(user => {
    const completedEvents = user.events.filter(
      event => event.status === EventStatus.COMPLETED,
    );
    const completedEventsCombinedWithEventInfo: CombinedEvent[] =
      completedEvents.map(doneEvent => {
        const eventInfo = events.find(event => event.id === doneEvent.eventID)!; //ok för vi vet att de måst finnas en event som matchar doneEvent.eventID
        return {
          ...doneEvent,
          ...eventInfo,
        };
      });
    const mandatoryEvents = completedEventsCombinedWithEventInfo.filter(
      event => event.mandatory,
    );
    const pointsByCategoryId = getPointsByCategoryFromCompletedEvents(
      completedEventsCombinedWithEventInfo,
    );
    const userWithCompletedPointsByCategory = {
      id: user.id!, //user must have an Id at this point
      name: user.firstName + ' ' + user.lastName,
      pointsByCategory: pointsByCategoryId,
      mandatoryEvents: mandatoryEvents,
    };
    return userWithCompletedPointsByCategory;
  });

  const nameColumn: GridColDef = {
    field: 'name',
    headerName: 'Namn',
    description:
      'Användarens hela namn. Grön ifall alla kategorier uppfyller poängkraven.',
    width: 150,
    cellClassName: params =>
      categories.every(category => {
        const pointsInCategory:
          | {
              categoryId: number;
              points: number | undefined;
            }
          | undefined = params.row.pointsByCategory.find(
          (p: { categoryId: number; points: number | undefined }) =>
            p.categoryId === category.id,
        );
        return (pointsInCategory?.points ?? 0) >= (category.minPoints ?? 0);
      })
        ? 'all_categories_check'
        : '',
  };

  const categoryColumns: GridColDef[] = categories.map(category => {
    const categoryColumn: GridColDef = {
      field: `${category.id}`,
      headerName: category.name,
      description: `${category.description}. Minimipoängmänden är ${category.minPoints}`,
      width: 180,
      valueGetter: params =>
        `${
          params.row.pointsByCategory.find(
            (p: { categoryId: number; points: number }) =>
              p.categoryId === category.id,
          )?.points ?? 0
        }`,
      cellClassName: params =>
        (params.row.pointsByCategory.find(
          (p: { categoryId: number; points: number }) =>
            p.categoryId === category.id,
        )?.points ?? 0) >= (category.minPoints ?? 0)
          ? 'mandatory_done'
          : 'mandatory_not_done',
    };
    return categoryColumn;
  });

  const mandatoryEventColumns: GridColDef[] = events
    .filter(event => event.mandatory)
    .map(event => {
      const categoryColumn: GridColDef = {
        field: `event_${event.id}`,
        headerName: event.name,
        description: `${event.description}.`,
        width: 180,
        valueGetter: params =>
          `${
            params.row.mandatoryEvents.find(
              (mandatoryId: { id: number }) => mandatoryId.id === event.id,
            )
              ? 'Gjort'
              : 'Ogjort'
          }`,
        cellClassName: params =>
          params.row.mandatoryEvents.find(
            (mandatoryId: { id: number }) => mandatoryId.id === event.id,
          )
            ? 'mandatory_done'
            : 'mandatory_not_done',
      };
      return categoryColumn;
    });

  const columnsWithNames = [
    nameColumn,
    ...categoryColumns,
    ...mandatoryEventColumns,
  ];

  return (
    <>
      <div className={classes.DataGrid}>
        <div style={{ display: 'flex', height: '100%' }}>
          <DataGrid
            autoHeight
            paginationModel={{ page: 0, pageSize: 10 }}
            rows={usersWithCompletedPoints}
            columns={columnsWithNames}
            onRowClick={(params, event) => {
              openPersonCard(params, event);
            }}
            hideFooterSelectedRowCount={true}
          />
        </div>
      </div>
      {userToShow && (
        <UserCard
          user={users.find(user => user.id === userToShow)!}
          allEvents={events}
          allCategories={categories}
          clearUserId={() => setUserToShow(undefined)}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  DataGrid: {
    width: '100%',
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
  '@global': {
    '.mandatory_not_done': {
      backgroundColor: theme.palette.secondary.light,
    },
    '.all_categories_check': {
      backgroundColor: theme.palette.success.main,
    },
  },
}));

export default UserSummary;
