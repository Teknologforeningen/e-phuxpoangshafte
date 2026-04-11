import React from 'react';
import { Box, Card, CardContent, Typography, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

interface Props {
  totalCompletedPoints: number;
  totalRequiredPoints: number;
}

const TotalPointsSummary = ({
  totalCompletedPoints,
  totalRequiredPoints,
}: Props) => {
  const classes = useStyles();

  const hasValidCompletedPoints = Number.isFinite(totalCompletedPoints);
  const hasValidRequiredPoints =
    Number.isFinite(totalRequiredPoints) && totalRequiredPoints > 0;
  const totalProgressPct =
    hasValidCompletedPoints && hasValidRequiredPoints
      ? Math.min(
          Math.max((totalCompletedPoints / totalRequiredPoints) * 100, 0),
          100,
        )
      : 0;
  const totalGoalReached =
    hasValidCompletedPoints &&
    hasValidRequiredPoints &&
    totalCompletedPoints >= totalRequiredPoints;

  return (
    <Card variant={'outlined'} className={classes.cardLayout}>
      <CardContent>
        <Box className={classes.summaryHeader}>
          <Typography
            fontWeight="fontWeightBold"
            className={classes.summaryTitle}
          >
            Totala poäng
          </Typography>
          <Typography
            className={
              totalGoalReached ? classes.badgeSuccess : classes.badgePending
            }
          >
            {totalGoalReached ? '✓ Klart' : 'Pågående'}
          </Typography>
        </Box>
        <Typography className={classes.summarySubtitle}>
          {`Minst ${totalRequiredPoints} poäng krävs`}
        </Typography>
        <Box className={classes.totalBarContainer}>
          {/* Background track */}
          <Box className={classes.totalBarTrack} />
          {/* Filled progress */}
          <Box
            className={classes.totalBarFill}
            style={{
              width: `${totalProgressPct}%`,
              backgroundColor: totalGoalReached ? '#43a047' : undefined,
            }}
          />
          {/* Labels overlay */}
          <Box className={classes.totalBarLabels}>
            <Typography className={classes.totalBarLabelLeft}>
              {totalCompletedPoints}
            </Typography>
            <Typography className={classes.totalBarLabelRight}>
              {totalRequiredPoints}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      cardLayout: {
        margin: theme.spacing(2, 0),
      },
      summaryHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      summaryTitle: {
        color: theme.palette.secondary.main,
        fontSize: '12pt',
      },
      summarySubtitle: {
        color: '#454545',
        fontSize: '10pt',
        marginBottom: theme.spacing(1),
      },
      badgeSuccess: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        borderRadius: '12px',
        padding: '2px 10px',
        fontSize: '10pt',
        fontWeight: 'bold',
      },
      badgePending: {
        backgroundColor: theme.palette.warning.main,
        color: '#fff',
        borderRadius: '12px',
        padding: '2px 10px',
        fontSize: '10pt',
        fontWeight: 'bold',
      },
      totalBarContainer: {
        display: 'grid',
        marginTop: theme.spacing(2),
        borderRadius: '5px',
        overflow: 'hidden',
      },
      totalBarTrack: {
        gridRow: 1,
        gridColumn: 1,
        height: '40px',
        borderRadius: '5px',
        border: `1px solid ${theme.palette.secondary.main}`,
        backgroundColor: 'transparent',
      },
      totalBarFill: {
        gridRow: 1,
        gridColumn: 1,
        height: '40px',
        borderRadius: '5px',
        backgroundColor: theme.palette.secondary.main,
        transition: 'width 0.5s ease',
        alignSelf: 'stretch',
      },
      totalBarLabels: {
        gridRow: 1,
        gridColumn: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        fontWeight: 'bold',
        fontSize: '1rem',
        pointerEvents: 'none',
      },
      totalBarLabelLeft: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#000', // ensure contrast
      },
      totalBarLabelRight: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#000',
      },
    }),
  { index: 1 },
);

export default TotalPointsSummary;
