import { groupBy } from 'lodash';
import { CombinedEvent } from '../types';

export const getPointsByCategoryFromCompletedEvents = (
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
