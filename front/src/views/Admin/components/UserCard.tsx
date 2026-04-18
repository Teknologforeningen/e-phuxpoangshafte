import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Collapse,
  Table,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import classNames from 'classnames';
import {
  User,
  Event,
  Category,
  EventStatus,
  CombinedEvent,
  DoneEvent,
} from '../../../types';
import { groupBy } from 'lodash';
import { getPointsByCategoryFromCompletedEvents } from '../../../utils/admin';
import {
  CloseOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import * as UserService from '../../../services/UserServices';
import {
  ErrorNotification,
  InfoNotification,
  SuccessNotification,
} from '../../../components/Notifications';

interface Props {
  user: User;
  allEvents: Event[];
  allCategories: Category[];
  clearUserId: () => void;
  onRefresh?: () => void;
}
const UserCard = (props: Props) => {
  const classes = useStyles();
  const { user, allEvents, allCategories, clearUserId, onRefresh } = props;
  const [openCategoryRows, setOpenCategoryRows] = useState<string[]>([]);

  const eventsByCategoryId = groupBy(allEvents, 'categoryId');

  const pendingEvents = user.events.filter(
    e => e.status === EventStatus.PENDING,
  );
  const pendingWithInfo = pendingEvents
    .map(de => ({
      doneEvent: de,
      event: allEvents.find(ev => ev.id === de.eventID)!,
    }))
    .filter(p => p.event);

  const handleApprove = useCallback(
    async (event: Event) => {
      try {
        await UserService.updateUserEventStatus(
          user,
          event.id,
          EventStatus.COMPLETED,
        );
        SuccessNotification(
          `${event.name} för ${user.firstName} ${user.lastName} har godkänts!`,
        );
        onRefresh?.();
      } catch {
        ErrorNotification(`${event.name} kunde inte godkännas!`);
      }
    },
    [user, onRefresh],
  );

  const handleDecline = useCallback(
    async (event: Event) => {
      try {
        await UserService.updateUserEventStatus(
          user,
          event.id,
          EventStatus.CANCELLED,
        );
        InfoNotification(
          `${event.name} för ${user.firstName} ${user.lastName} har förkastats`,
        );
        onRefresh?.();
      } catch {
        ErrorNotification(`${event.name} kunde inte förkastas!`);
      }
    },
    [user, onRefresh],
  );

  const completedEvents = user.events.filter(
    event => event.status === EventStatus.COMPLETED,
  );
  const completedEventsCombinedWithEventInfo: CombinedEvent[] =
    completedEvents.map(doneEvent => {
      const eventInfo = allEvents.find(
        event => event.id === doneEvent.eventID,
      )!; //ok för vi vet att de måst finnas en event som matchar doneEvent.eventID
      return {
        ...doneEvent,
        ...eventInfo,
      };
    });

  const pointsByCategoryId = getPointsByCategoryFromCompletedEvents(
    completedEventsCombinedWithEventInfo,
  );

  const renderEvent = (event: Event) => {
    const usersEventsIncludeEvent = user.events.find(
      doneEvent => doneEvent.eventID === event.id,
    );

    return (
      <TableRow className={classes.tableHeader}>
        <TableCell className={classes.firstTh}>{event.name}</TableCell>
        <TableCell align="right">
          {usersEventsIncludeEvent ? 'Gjort' : 'Ogjort'}
          {usersEventsIncludeEvent && event.points
            ? `, ${event.points} poäng`
            : ''}
        </TableCell>
      </TableRow>
    );
  };

  const renderEvents = (events: Event[]) => {
    return events.map(event => {
      return renderEvent(event);
    });
  };

  const handleCategoryRowClick = (categoryId: string) => {
    let newCategories: string[] = [];
    if (openCategoryRows.includes(categoryId)) {
      newCategories = openCategoryRows.filter(
        openCategoryId => categoryId !== openCategoryId,
      );
    } else {
      newCategories = [...openCategoryRows, categoryId];
    }
    setOpenCategoryRows(newCategories);
  };

  const renderCategory = (categoryId: string, events: Event[]) => {
    const category = allCategories.find(
      category => category.id === Number(categoryId),
    )!;
    const userPointsInCategory =
      pointsByCategoryId.find(p => p.categoryId === Number(categoryId))
        ?.points ?? 0;
    return (
      <Table>
        <TableRow
          onClick={() => {
            handleCategoryRowClick(categoryId);
          }}
        >
          <TableHead className={classes.tableHeader}>
            <TableCell
              className={classNames(classes.tableHead, classes.firstTh)}
            >
              {category.name}
            </TableCell>
            <TableCell
              className={
                userPointsInCategory >= (category.minPoints ?? 0)
                  ? classNames(classes.tableHead, classes.categoryDone)
                  : classes.tableHead
              }
              align="right"
            >
              {`${userPointsInCategory} / ${category.minPoints ?? 0}`}
            </TableCell>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => handleCategoryRowClick(categoryId)}
              >
                {openCategoryRows.includes(categoryId) ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )}
              </IconButton>
            </TableCell>
          </TableHead>
        </TableRow>
        <TableRow>
          <Collapse in={openCategoryRows.includes(categoryId)}>
            {renderEvents(events)}
          </Collapse>
        </TableRow>
      </Table>
    );
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 'none', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex' }}>
          <Typography
            variant={'h5'}
            gutterBottom
            fontWeight={'bold'}
            sx={{ flex: '1 0 0' }}
          >
            {user.firstName + ' ' + user.lastName}
          </Typography>
          <IconButton size="small" onClick={() => clearUserId()}>
            <CloseOutlined />
          </IconButton>
        </Box>

        {pendingWithInfo.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="subtitle2" fontWeight={700} color="#C05621">
                Väntande förfrågningar
              </Typography>
              <Chip
                label={pendingWithInfo.length}
                size="small"
                sx={{
                  height: 20,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(237, 137, 54, 0.15)',
                  color: '#C05621',
                }}
              />
            </Box>
            {pendingWithInfo.map(({ event, doneEvent }) => (
              <Box
                key={event.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  py: 0.5,
                  px: 1,
                  mb: 0.5,
                  borderRadius: '8px',
                  bgcolor: 'rgba(237, 137, 54, 0.05)',
                  border: '1px solid rgba(237, 137, 54, 0.15)',
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {event.name}
                  </Typography>
                  <Typography variant="caption" color="#718096">
                    {event.points ? `${event.points} poäng` : 'Obligatorisk'}
                    {' · '}
                    {new Date(doneEvent.timeOfSignup).toLocaleDateString(
                      'sv-SE',
                      {
                        day: 'numeric',
                        month: 'short',
                      },
                    )}
                  </Typography>
                </Box>
                <Box display="flex" gap={0.5}>
                  <Tooltip title="Godkänn">
                    <IconButton
                      size="small"
                      sx={{ color: '#2F855A' }}
                      onClick={() => handleApprove(event)}
                    >
                      <CheckCircle fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Förkasta">
                    <IconButton
                      size="small"
                      sx={{ color: '#C53030' }}
                      onClick={() => handleDecline(event)}
                    >
                      <Cancel fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
            <Divider sx={{ mt: 1.5, mb: 0.5 }} />
          </Box>
        )}

        {Object.entries(eventsByCategoryId).map(([categoryId, events]) =>
          renderCategory(categoryId, events),
        )}
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  tableHeader: {
    display: 'flex',
  },
  tableHead: {
    fontWeight: 'bold',
  },
  firstTh: {
    flex: '1 0 0',
  },
  categoryDone: {
    color: theme.palette.success.main,
  },
}));

export default UserCard;
