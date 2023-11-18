import React from 'react';
import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import { Category, Event } from '../../../types';
import { Done, DoneAll, InfoOutlined as InfoIcon } from '@mui/icons-material/';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import classnames from 'classnames';

interface Props {
  category: Category;
  progress: number;
  currentAmount: number;
  requiredAmount: number;
}

interface StyleProps extends Props {
  widthBreakVerified: number;
}

const CategoryProgress = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const { category, progress, currentAmount, requiredAmount } = props;
  const totalAvailablePoints = category.events.reduce(
    (sum: number, event: Event) => (event.points ? sum + event.points : sum),
    0,
  );
  const widthBreak: number | null =
    requiredAmount && totalAvailablePoints > 0
      ? requiredAmount / totalAvailablePoints
      : null;
  const widthBreakVerified = Math.min(widthBreak ? widthBreak * 100 : 0, 100);
  const widthBreakComplementVerified = 100 - widthBreakVerified;
  const styleProps: StyleProps = { ...props, widthBreakVerified };
  const classes = useStyles(styleProps);
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
    <Card variant={'outlined'} className={classes.spacing}>
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
        <Box className={classes.barContainer}>
          <Box
            className={classnames(
              classes.wrapper,
              classes.solidBorder,
              classes.transparent,
            )}
          ></Box>
          <Box
            className={classes.wrapper}
            style={{ width: `${progress}%` }}
          ></Box>
          <Box className={classnames(classes.sameGrid, classes.flexBox)}>
            {/*Box for amount after required amount*/}
            {requiredAmount && requiredAmount > 0 ? (
              <Box
                className={classnames(
                  classes.wrapper,
                  classes.dashedRightBorder,
                  classes.transparent,
                )}
                style={{ width: `${widthBreakVerified}%` }}
              >
                <Box>{currentAmount}</Box>
                <Box className={classes.offsetTextTop}>{requiredAmount}</Box>
              </Box>
            ) : (
              <Box
                className={classnames(
                  classes.wrapper,
                  classes.dashedRightBorder,
                  classes.transparent,
                )}
                style={{ width: `${widthBreakVerified}%` }}
              >
                <Box>{currentAmount}</Box>
              </Box>
            )}
            {/*Box for amount after required amount*/}
            {totalAvailablePoints &&
            totalAvailablePoints > 0 &&
            totalAvailablePoints > requiredAmount ? (
              <Box
                className={classnames(classes.wrapper, classes.transparent)}
                style={{ width: `${widthBreakComplementVerified}%` }}
              >
                <Box className={classes.rightAlignText}>
                  {totalAvailablePoints}
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
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
    barContainer: {
      display: 'grid',
      paddingTop: '20px',
    },
    wrapper: {
      gridRow: 1,
      gridColumn: 1,
      position: 'relative',
      display: 'grid',
      flexDirection: 'row',
      gridTemplateColumns: '1fr auto',
      gap: theme.spacing(1),
      //width: '100%',
      minHeight: '40px',
      alignSelf: 'stretch',
      padding: theme.spacing(1),
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 'bold',
      backgroundColor: theme.palette.secondary.main,
      transition: 'background-color 0.5s, opacity 0.1s',
    },
    rightAlignText: {
      textAlign: 'right',
    },
    offsetTextTop: {
      position: 'relative',
      right: '-20px',
      top: '-30px',
    },
    //TODO: test color change
    dashedRightBorder: {
      borderRightStyle: 'dashed',
      borderColor: (props: StyleProps) =>
        props.progress < props.widthBreakVerified
          ? theme.palette.secondary.main
          : theme.palette.primary.main,
    },
    solidBorder: {
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
    },
    transparent: {
      backgroundColor: 'transparent',
    },
    flexBox: {
      display: 'flex',
    },
    sameGrid: {
      gridRow: 1,
      gridColumn: 1,
    },
    spacing: {
      margin: theme.spacing(2, 0),
    },
  }),
);

export default CategoryProgress;
