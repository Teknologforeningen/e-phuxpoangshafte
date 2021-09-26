import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Category } from '../../../types';
import { Done, DoneAll, InfoOutlined as InfoIcon } from '@material-ui/icons/';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

interface Props {
  category: Category;
  progress: number;
  currentAmount: number;
  requiredAmount: number;
}

const CategoryProgress = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles(props);
  const { category, progress, currentAmount, requiredAmount } = props;
  const progressIcon =
    requiredAmount > 0 ? (
      currentAmount > 0 ? (
        progress >= (currentAmount / requiredAmount) * 100 ? (
          <DoneAll color={'success'} />
        ) : (
          <Done color={'warning'} />
        )
      ) : (
        <></>
      )
    ) : (
      <></>
    );
  //Legacy loader bar
  /*const ThickLinearProgress = withStyles({
    root: {
      height: 16,
      margin: '8px auto',
    },
  })(LinearProgress);*/

  return (
    <Card variant={'outlined'}>
      <CardContent>
        <Box className={classes.evenlySpacedBox}>
          <Box display="flex" alignItems="center">
            <Typography className={classes.title} fontWeight="fontWeightBold">
              {category.name}
            </Typography>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              title={category.description}
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
            >
              <InfoIcon
                className={classes.smallInfoIcon}
                onClick={() => setOpen(true)}
              />
            </Tooltip>
          </Box>
          {progressIcon}
        </Box>
        {category.minPoints ? (
          <Typography
            className={classes.subtitle}
          >{`minst ${category.minPoints} poäng`}</Typography>
        ) : (
          ''
        )}
        <Box className={classes.wrapper}>
          <Box>{currentAmount}</Box>
          <Box className={classes.rightAlignText}>{requiredAmount}</Box>
        </Box>
        {/*<Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <ThickLinearProgress
              variant="buffer"
              color="secondary"
              value={progress}
            />
          </Box>
          <Box minWidth={35}>
            <Typography
              variant="body2"
              color="textSecondary"
            >{`${currentAmount}/${requiredAmount}`}</Typography>
          </Box>
        </Box>*/}
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.secondary.main,
      fontSize: '12pt',
    },
    subtitle: {
      color: '#454545',
      fontSize: '10pt',
    },
    evenlySpacedBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    smallInfoIcon: {
      fontSize: 'small',
    },
    wrapper: {
      position: 'relative',
      display: 'grid',
      alignItem: 'center',
      gridTemplateColumns: '1fr auto',
      gap: theme.spacing(1),
      width: '100%',
      minHeight: '60px',
      alignSelf: 'stretch',
      padding: theme.spacing(1),
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 'bold',
      backgroundColor: theme.palette.secondary.main,
      transition: 'background-color 0.5s, opacity 0.1s',
      '&::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: (props: Props) => `${props.progress}%`,
        borderRadius: (props: Props) =>
          props.progress === 100 ? '5px' : '5px 0 0 5px',
        backgroundColor: theme.palette.secondary.main,
      },
    },
    rightAlignText: {
      alignText: 'right',
    },
  }),
);

export default CategoryProgress;
