import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  RowDoubleClickedEvent,
} from 'ag-grid-community';

import { Theme, Box, Chip } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { groupBy, orderBy } from 'lodash';

import * as UserService from '../../services/UserServices';
import * as EventSelector from '../../selectors/EventSelectors';
import * as CategorySelector from '../../selectors/CategorySelectors';
import * as SiteSettingsSelectors from '../../selectors/SiteSettingsSelectors';
import {
  Event,
  User,
  UserRole,
  EventStatus,
  Category,
  CombinedEvent,
} from '../../types';
import UserCard from './components/UserCard';
import AdminLayout from './components/AdminLayout';

const PointStatusRenderer = (params: ICellRendererParams) => {
  const { value, colDef } = params;
  if (!colDef || value === undefined) return null;

  const points = Number(value.points ?? 0);
  const minPoints = Number(colDef.cellRendererParams?.minPoints ?? 0);
  const isOk = points >= minPoints;

  return (
    <Chip
      label={points.toString()}
      size="small"
      sx={{
        fontWeight: 700,
        bgcolor: isOk ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
        color: isOk ? '#2F855A' : '#C53030',
        borderRadius: '8px',
        border: 'none',
        fontSize: '0.75rem',
      }}
    />
  );
};

const MandatoryRenderer = (params: ICellRendererParams) => {
  const isDone = params.value === true;
  return (
    <Chip
      label={isDone ? 'Gjord' : 'Ogjort'}
      size="small"
      sx={{
        fontWeight: 700,
        bgcolor: isDone ? 'rgba(72, 187, 120, 0.1)' : '#f8fafc',
        color: isDone ? '#2F855A' : '#718096',
        borderRadius: '8px',
        border: isDone ? 'none' : '1px solid #edf2f7',
        fontSize: '0.75rem',
      }}
    />
  );
};

const AllOkRenderer = (params: ICellRendererParams) => {
  const val = params.value;
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {val.allOk && <span style={{ color: '#436436', fontSize: 18 }}>●</span>}
      <span>{val.name}</span>
    </Box>
  );
};

const UserSummary = () => {
  const classes = useStyles();
  const events: Event[] = useSelector(
    EventSelector.allEventsOrderedByStartTime,
  );
  const categories: Category[] = useSelector(
    CategorySelector.allCategoriesOrderedByNameAsc,
  );
  const siteSettingsState = useSelector(SiteSettingsSelectors.siteSettings);
  const totalMinPoints = siteSettingsState.settings?.totalMinPoints ?? 0;

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

  const usersNoAdmins = useMemo(
    () => users?.filter((user: User) => user.role !== UserRole.ADMIN) || [],
    [users],
  );

  const rowData = useMemo(() => {
    if (!usersNoAdmins.length || !events.length || !categories.length)
      return [];

    return usersNoAdmins.map(user => {
      const completedEvents = user.events.filter(
        event => event.status === EventStatus.COMPLETED,
      );
      const completedEventsCombinedWithEventInfo: CombinedEvent[] =
        completedEvents.map(doneEvent => {
          const eventInfo = events.find(
            event => event.id === doneEvent.eventID,
          )!;
          return { ...doneEvent, ...eventInfo };
        });

      const mandatoryEvents = completedEventsCombinedWithEventInfo.filter(
        event => event.mandatory,
      );

      const groupedByCat = groupBy(
        completedEventsCombinedWithEventInfo,
        'categoryId',
      );
      const pointsByCategoryId = Object.entries(groupedByCat).map(
        ([categoryId, catEvents]) => {
          const sumOfEventPoints = catEvents.reduce(
            (a, b) => (b.points ? a + b.points : a),
            0,
          );
          return { categoryId: Number(categoryId), points: sumOfEventPoints };
        },
      );

      const totalPoints = pointsByCategoryId.reduce(
        (sum, p) => sum + (p.points ?? 0),
        0,
      );
      const totalOk = totalPoints >= totalMinPoints;

      const catsOk = categories.every(category => {
        const pointsInCategory = pointsByCategoryId.find(
          p => p.categoryId === category.id,
        );
        return (pointsInCategory?.points ?? 0) >= (category.minPoints ?? 0);
      });

      const row: any = {
        id: user.id!,
        nameData: {
          name: user.firstName + ' ' + user.lastName,
          allOk: catsOk && totalOk,
        },
        fieldOfStudy: user.fieldOfStudy,
        total: { points: totalPoints },
      };

      categories.forEach(category => {
        const found = pointsByCategoryId.find(
          p => p.categoryId === category.id,
        );
        row[`cat_${category.id}`] = { points: found?.points ?? 0 };
      });

      events
        .filter(e => e.mandatory)
        .forEach(event => {
          row[`event_${event.id}`] = mandatoryEvents.some(
            me => me.id === event.id,
          );
        });

      return row;
    });
  }, [usersNoAdmins, events, categories, totalMinPoints]);

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(() => {
    const mandatoryEvents = events.filter(e => e.mandatory);

    // --- Pinned name column (standalone, outside groups) ---
    const nameCol: ColDef = {
      field: 'nameData',
      headerName: 'Namn',
      width: 200,
      pinned: 'left',
      cellRenderer: AllOkRenderer,
      comparator: (a: any, b: any) => a.name.localeCompare(b.name),
    };

    // --- ÖVERGRIPANDE group: Studieriktning, Totala poäng ---
    const overviewGroup: ColGroupDef = {
      headerName: 'ÖVERGRIPANDE',
      marryChildren: true,
      children: [
        {
          field: 'fieldOfStudy',
          headerName: 'Studieriktning',
          width: 160,
          columnGroupShow: 'open',
        },
        {
          field: 'total',
          headerName: 'Totala poäng',
          headerTooltip: `Totalt insamlade poäng över alla kategorier. Minimikrav är ${totalMinPoints}`,
          width: 150,
          cellRenderer: PointStatusRenderer,
          cellRendererParams: { minPoints: totalMinPoints },
          comparator: (a: any, b: any) => (a.points ?? 0) - (b.points ?? 0),
        },
      ],
    };

    // --- Per-category groups: category points + mandatory events from that category ---
    const categoryGroups: ColGroupDef[] = categories.map(category => {
      const catMandatoryEvents = mandatoryEvents.filter(
        e => e.categoryId === category.id,
      );
      const children: ColDef[] = [
        {
          field: `cat_${category.id}`,
          headerName: 'Kategori Poäng',
          headerTooltip: `${category.description}. Minimipoängmänden är ${category.minPoints}`,
          width: 160,
          cellRenderer: PointStatusRenderer,
          cellRendererParams: { minPoints: category.minPoints ?? 0 },
          comparator: (a: any, b: any) => (a.points ?? 0) - (b.points ?? 0),
        },
        ...catMandatoryEvents.map(event => ({
          field: `event_${event.id}`,
          headerName: event.name,
          headerTooltip: event.description,
          width: 160,
          cellRenderer: MandatoryRenderer,
          columnGroupShow: 'open' as const,
        })),
      ];
      return {
        headerName: category.name,
        marryChildren: true,
        children,
      };
    });

    // --- ÖVRIGA KRAV: mandatory events not belonging to any known category ---
    const categoryIds = new Set(categories.map(c => c.id));
    const leftoverMandatory = mandatoryEvents.filter(
      e => !categoryIds.has(e.categoryId),
    );
    const extraGroup: ColGroupDef | null =
      leftoverMandatory.length > 0
        ? {
            headerName: 'ÖVRIGA KRAV',
            marryChildren: true,
            children: leftoverMandatory.map(event => ({
              field: `event_${event.id}`,
              headerName: event.name,
              headerTooltip: event.description,
              width: 160,
              cellRenderer: MandatoryRenderer,
              columnGroupShow: 'open' as const,
            })),
          }
        : null;

    return [
      nameCol,
      overviewGroup,
      ...categoryGroups,
      ...(extraGroup ? [extraGroup] : []),
    ];
  }, [categories, events, totalMinPoints]);

  const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent) => {
    const userId = Number(event.data.id);
    setUserToShow(userId);
  }, []);

  return (
    <AdminLayout
      title="Sammanställning"
      description="Total sammanställning av alla användares poäng dividerat i kategorier."
    >
      <Box className={classes.agGridContainer}>
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
            onRowDoubleClicked={onRowDoubleClicked}
          />
        </div>
      </Box>

      {userToShow && users && (
        <UserCard
          user={users.find(user => user.id === userToShow)!}
          allEvents={events}
          allCategories={categories}
          clearUserId={() => setUserToShow(undefined)}
        />
      )}
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
      },
    },
  }),
);

export default UserSummary;
