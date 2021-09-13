import React from 'react';
import { Box, Card, CardContent, Tooltip, Typography } from '@material-ui/core';
import { Category } from '../../../types';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';
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
  const classes = useStyles(props);
  console.log(props.progress);
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
  const ThickLinearProgress = withStyles({
    root: {
      height: 16,
      margin: '8px auto',
    },
  })(LinearProgress);
  return (
    <Card variant={'outlined'}>
      <CardContent>
        <Box className={classes.evenlySpacedBox}>
          <Box display="flex" alignItems="center">
            <Typography className={classes.title} fontWeight="fontWeightBold">
              {category.name}
            </Typography>
            <Tooltip disableFocusListener title={category.description}>
              <InfoIcon className={classes.smallInfoIcon} />
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
        <Box display="flex" alignItems="center">
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
        </Box>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
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
    }),
  { index: 1 },
);

export default CategoryProgress;
