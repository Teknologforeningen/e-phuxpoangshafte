import React, { useState } from 'react';
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
} from '../../../types';
import { groupBy } from 'lodash';
import { getPointsByCategoryFromCompletedEvents } from '../../../utils/admin';
import {
  CloseOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';

interface Props {
  user: User;
  allEvents: Event[];
  allCategories: Category[];
  clearUserId: () => void;
}
const UserCard = (props: Props) => {
  const classes = useStyles();
  const { user, allEvents, allCategories, clearUserId } = props;
  const [openCategoryRows, setOpenCategoryRows] = useState<string[]>([]);

  const eventsByCategoryId = groupBy(allEvents, 'categoryId');

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
    <Card sx={{ minWidth: 275, maxWidth: 350, margin: '40px auto' }}>
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
