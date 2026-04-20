import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  RowClickedEvent,
  GridApi,
} from 'ag-grid-community';

import {
  Theme,
  Box,
  Chip,
  Button,
  Badge,
  Drawer,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Tooltip,
  Autocomplete,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';

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

const PendingCountRenderer = (params: ICellRendererParams) => {
  const count = params.value ?? 0;
  if (count === 0) return null;
  return (
    <Badge
      badgeContent={count}
      color="warning"
      sx={{
        '& .MuiBadge-badge': {
          fontWeight: 700,
          fontSize: '0.7rem',
        },
      }}
    >
      <Chip
        label="Väntande"
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: 'rgba(237, 137, 54, 0.1)',
          color: '#C05621',
          borderRadius: '8px',
          border: 'none',
          fontSize: '0.75rem',
        }}
      />
    </Badge>
  );
};

const segBtnOk = {
  textTransform: 'none',
  fontSize: '0.7rem',
  fontWeight: 600,
  px: 1.5,
  py: 0.25,
  '&.Mui-selected': {
    bgcolor: '#2F855A',
    color: '#fff',
    '&:hover': { bgcolor: '#276749' },
  },
} as const;

const segBtnBad = {
  textTransform: 'none',
  fontSize: '0.7rem',
  fontWeight: 600,
  px: 1.5,
  py: 0.25,
  '&.Mui-selected': {
    bgcolor: '#C53030',
    color: '#fff',
    '&:hover': { bgcolor: '#9B2C2C' },
  },
} as const;

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
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterCapWithTF, setFilterCapWithTF] = useState<
    'with' | 'without' | null
  >('with');

  const refreshUsers = useCallback(() => {
    setRefreshSeed(s => s + 1);
  }, []);

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
  }, [refreshSeed]);

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
        pendingCount: user.events.filter(e => e.status === EventStatus.PENDING)
          .length,
        _user: user,
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

    // --- Standalone columns: Name, field of study, pending requests, total points ---
    const nameCol: ColDef = {
      field: 'nameData',
      headerName: 'Namn',
      width: 200,
      pinned: 'left',
      cellRenderer: AllOkRenderer,
      comparator: (a: any, b: any) => a.name.localeCompare(b.name),
      filterValueGetter: (params: any) => params.data?.nameData?.name ?? '',
      filter: 'agTextColumnFilter',
    };
    const fieldOfStudyCol: ColDef = {
      field: 'fieldOfStudy',
      headerName: 'Studieriktning',
      width: 160,
      filter: 'agSetColumnFilter',
    };
    const pendingCol: ColDef = {
      field: 'pendingCount',
      headerName: 'Förfrågningar',
      headerTooltip: 'Antal väntande poängförfrågningar',
      width: 150,
      cellRenderer: PendingCountRenderer,
      comparator: (a: any, b: any) => (a ?? 0) - (b ?? 0),
      filter: 'agNumberColumnFilter',
    };
    const totalCol: ColDef = {
      field: 'total',
      headerName: 'Totala poäng',
      headerTooltip: `Totalt insamlade poäng över alla kategorier. Minimikrav är ${totalMinPoints}`,
      width: 150,
      cellRenderer: PointStatusRenderer,
      cellRendererParams: { minPoints: totalMinPoints },
      comparator: (a: any, b: any) => (a.points ?? 0) - (b.points ?? 0),
    };

    // --- Per-category groups: category points +  andatory events from that category ---
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
      {
        children: [nameCol, fieldOfStudyCol, pendingCol, totalCol],
      } as ColGroupDef,
      ...categoryGroups,
      ...(extraGroup ? [extraGroup] : []),
    ];
  }, [categories, events, totalMinPoints]);

  const onRowClicked = useCallback((event: RowClickedEvent) => {
    const userId = Number(event.data.id);
    setUserToShow(userId);
  }, []);

  const totalPendingCount = useMemo(
    () => rowData.reduce((sum, r) => sum + (r.pendingCount ?? 0), 0),
    [rowData],
  );

  const isExternalFilterPresent = useCallback(
    () =>
      showOnlyPending ||
      activeFilters.length > 0 ||
      selectedFields.length > 0 ||
      filterCapWithTF !== null,
    [showOnlyPending, activeFilters, selectedFields, filterCapWithTF],
  );
  const doesExternalFilterPass = useCallback(
    (node: any) => {
      const data = node.data;
      if (!data) return false;

      const pendingPass = !showOnlyPending || (data.pendingCount ?? 0) > 0;
      if (!pendingPass) return false;

      if (filterCapWithTF !== null) {
        const user: User = data._user;
        if (filterCapWithTF === 'with' && !user.capWithTF) return false;
        if (filterCapWithTF === 'without' && user.capWithTF) return false;
      }

      if (selectedFields.length > 0) {
        if (!selectedFields.includes(data.fieldOfStudy ?? '')) return false;
      }

      if (activeFilters.length === 0) return true;

      const checks = activeFilters.map(filterKey => {
        if (filterKey === 'total_ok') {
          return (data.total?.points ?? 0) >= totalMinPoints;
        }
        if (filterKey === 'total_not_ok') {
          return (data.total?.points ?? 0) < totalMinPoints;
        }
        if (filterKey.startsWith('cat_ok_')) {
          const catId = Number(filterKey.replace('cat_ok_', ''));
          const cat = categories.find(c => c.id === catId);
          return (data[`cat_${catId}`]?.points ?? 0) >= (cat?.minPoints ?? 0);
        }
        if (filterKey.startsWith('cat_not_ok_')) {
          const catId = Number(filterKey.replace('cat_not_ok_', ''));
          const cat = categories.find(c => c.id === catId);
          return (data[`cat_${catId}`]?.points ?? 0) < (cat?.minPoints ?? 0);
        }
        if (filterKey.startsWith('event_done_')) {
          const eventId = Number(filterKey.replace('event_done_', ''));
          const user: User = data._user;
          return user.events.some(
            e => e.eventID === eventId && e.status === EventStatus.COMPLETED,
          );
        }
        if (filterKey.startsWith('event_not_done_')) {
          const eventId = Number(filterKey.replace('event_not_done_', ''));
          const user: User = data._user;
          return !user.events.some(
            e => e.eventID === eventId && e.status === EventStatus.COMPLETED,
          );
        }
        return true;
      });

      return filterMode === 'AND'
        ? checks.every(Boolean)
        : checks.some(Boolean);
    },
    [
      showOnlyPending,
      activeFilters,
      filterMode,
      totalMinPoints,
      categories,
      selectedFields,
      filterCapWithTF,
    ],
  );

  const fieldOfStudyOptions = useMemo(
    () =>
      Array.from(
        new Set(rowData.map(r => r.fieldOfStudy as string).filter(Boolean)),
      ).sort(),
    [rowData],
  );

  useEffect(() => {
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [
    showOnlyPending,
    activeFilters,
    filterMode,
    selectedFields,
    filterCapWithTF,
    gridApi,
  ]);

  return (
    <AdminLayout
      title="Sammanställning"
      description="Samlad översikt av användare, poäng och förfrågningar."
    >
      <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
        <Button
          variant={showOnlyPending ? 'contained' : 'outlined'}
          size="small"
          startIcon={<FilterListIcon />}
          onClick={() => setShowOnlyPending(prev => !prev)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            ...(showOnlyPending
              ? { bgcolor: '#C05621', '&:hover': { bgcolor: '#9C4221' } }
              : { borderColor: '#e2e8f0', color: '#718096' }),
          }}
        >
          Visa väntande
          {totalPendingCount > 0 && (
            <Chip
              label={totalPendingCount}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontWeight: 700,
                fontSize: '0.7rem',
                bgcolor: showOnlyPending
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(237, 137, 54, 0.15)',
                color: showOnlyPending ? '#fff' : '#C05621',
              }}
            />
          )}
        </Button>

        <Button
          variant={activeFilters.length > 0 ? 'contained' : 'outlined'}
          size="small"
          startIcon={<TuneIcon />}
          onClick={e => setFilterAnchor(e.currentTarget)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            ...(activeFilters.length > 0
              ? { bgcolor: '#3182CE', '&:hover': { bgcolor: '#2B6CB0' } }
              : { borderColor: '#e2e8f0', color: '#718096' }),
          }}
        >
          Poängfilter
          {activeFilters.length > 0 && (
            <Chip
              label={activeFilters.length}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontWeight: 700,
                fontSize: '0.7rem',
                bgcolor: 'rgba(255,255,255,0.25)',
                color: '#fff',
              }}
            />
          )}
        </Button>
        {activeFilters.length > 0 && (
          <Button
            size="small"
            onClick={() => setActiveFilters([])}
            sx={{ textTransform: 'none', color: '#718096', fontSize: '0.8rem' }}
          >
            Rensa filter
          </Button>
        )}

        <ToggleButtonGroup
          value={filterCapWithTF}
          exclusive
          size="small"
          onChange={(_, val) => setFilterCapWithTF(val)}
        >
          <ToggleButton value="with" sx={segBtnOk}>
            Tar mössa med TF
          </ToggleButton>
          <ToggleButton value="without" sx={segBtnBad}>
            Tar inte mössa med TF
          </ToggleButton>
        </ToggleButtonGroup>

        <Autocomplete
          multiple
          size="small"
          options={fieldOfStudyOptions}
          value={selectedFields}
          onChange={(_, val) => setSelectedFields(val)}
          renderInput={params => (
            <TextField
              {...params}
              placeholder={selectedFields.length === 0 ? 'Studieriktning' : ''}
              variant="outlined"
              size="small"
            />
          )}
          sx={{ minWidth: 200, maxWidth: 400 }}
          ChipProps={{
            size: 'small',
            sx: { fontWeight: 600, fontSize: '0.75rem' },
          }}
        />

        <Popover
          open={!!filterAnchor}
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{
            sx: { p: 2, minWidth: 300, maxHeight: 480, overflowY: 'auto' },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Filtrera efter status
            </Typography>
            <ToggleButtonGroup
              value={filterMode}
              exclusive
              size="small"
              onChange={(_, val) => val && setFilterMode(val)}
              sx={{ ml: 2 }}
            >
              <ToggleButton
                value="AND"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.25,
                }}
              >
                <Tooltip title="Alla valda villkor måste uppfyllas">
                  <span>OCH</span>
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="OR"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.25,
                }}
              >
                <Tooltip title="Minst ett av villkoren måste uppfyllas">
                  <span>ELLER</span>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Typography
            variant="caption"
            color="textSecondary"
            fontWeight={600}
            sx={{ mt: 1, display: 'block' }}
          >
            Totala poäng
          </Typography>
          <ToggleButtonGroup
            value={
              activeFilters.includes('total_ok')
                ? 'ok'
                : activeFilters.includes('total_not_ok')
                  ? 'not_ok'
                  : null
            }
            exclusive
            size="small"
            onChange={(_, val) =>
              setActiveFilters(prev => {
                const cleaned = prev.filter(
                  f => f !== 'total_ok' && f !== 'total_not_ok',
                );
                if (val === 'ok') return [...cleaned, 'total_ok'];
                if (val === 'not_ok') return [...cleaned, 'total_not_ok'];
                return cleaned;
              })
            }
            sx={{ mt: 0.5, display: 'flex' }}
          >
            <ToggleButton value="ok" sx={segBtnOk}>
              ✓ Uppfyllt (≥ {totalMinPoints}p)
            </ToggleButton>
            <ToggleButton value="not_ok" sx={segBtnBad}>
              ✗ Ej uppfyllt
            </ToggleButton>
          </ToggleButtonGroup>

          {categories.map(cat => {
            const catEvents = events.filter(e => e.categoryId === cat.id);
            if (catEvents.length === 0) return null;
            const catOkKey = `cat_ok_${cat.id}`;
            const catNotOkKey = `cat_not_ok_${cat.id}`;
            return (
              <Box key={cat.id}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ mt: 1.5, display: 'block' }}
                >
                  {cat.name}
                </Typography>
                <ToggleButtonGroup
                  value={
                    activeFilters.includes(catOkKey)
                      ? 'ok'
                      : activeFilters.includes(catNotOkKey)
                        ? 'not_ok'
                        : null
                  }
                  exclusive
                  size="small"
                  onChange={(_, val) =>
                    setActiveFilters(prev => {
                      const cleaned = prev.filter(
                        f => f !== catOkKey && f !== catNotOkKey,
                      );
                      if (val === 'ok') return [...cleaned, catOkKey];
                      if (val === 'not_ok') return [...cleaned, catNotOkKey];
                      return cleaned;
                    })
                  }
                  sx={{ mt: 0.5, display: 'flex' }}
                >
                  <ToggleButton value="ok" sx={segBtnOk}>
                    ✓ Uppfyllt (≥ {cat.minPoints ?? 0}p)
                  </ToggleButton>
                  <ToggleButton value="not_ok" sx={segBtnBad}>
                    ✗ Ej uppfyllt
                  </ToggleButton>
                </ToggleButtonGroup>
                {catEvents.map(event => {
                  const doneKey = `event_done_${event.id}`;
                  const notDoneKey = `event_not_done_${event.id}`;
                  return (
                    <ToggleButtonGroup
                      key={event.id}
                      value={
                        activeFilters.includes(doneKey)
                          ? 'done'
                          : activeFilters.includes(notDoneKey)
                            ? 'not_done'
                            : null
                      }
                      exclusive
                      size="small"
                      onChange={(_, val) =>
                        setActiveFilters(prev => {
                          const cleaned = prev.filter(
                            f => f !== doneKey && f !== notDoneKey,
                          );
                          if (val === 'done') return [...cleaned, doneKey];
                          if (val === 'not_done')
                            return [...cleaned, notDoneKey];
                          return cleaned;
                        })
                      }
                      sx={{ mt: 0.5, ml: 1, display: 'flex' }}
                    >
                      <ToggleButton value="done" sx={segBtnOk}>
                        ✓ {event.name}
                        {event.mandatory ? ' ★' : ''}
                      </ToggleButton>
                      <ToggleButton value="not_done" sx={segBtnBad}>
                        ✗ Ogjord
                      </ToggleButton>
                    </ToggleButtonGroup>
                  );
                })}
              </Box>
            );
          })}
        </Popover>
      </Box>
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
            pagination={true}
            paginationPageSize={20}
            onRowClicked={onRowClicked}
            onGridReady={params => setGridApi(params.api)}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}
          />
        </div>
      </Box>

      {users && (
        <Drawer
          anchor="right"
          open={!!userToShow}
          onClose={() => setUserToShow(undefined)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 480 },
              boxSizing: 'border-box',
              overflowY: 'auto',
              top: '60px',
              height: 'calc(100% - 60px)',
            },
          }}
        >
          {userToShow && (
            <UserCard
              user={users.find(user => user.id === userToShow)!}
              allEvents={events}
              allCategories={categories}
              clearUserId={() => setUserToShow(undefined)}
              onRefresh={refreshUsers}
            />
          )}
        </Drawer>
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
