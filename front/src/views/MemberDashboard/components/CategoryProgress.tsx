import { Typography } from '@material-ui/core';
import React from 'react';
import { Category } from '../../../types';
import LinearProgress from '@material-ui/core/LinearProgress';

const CategoryProgress = ({
  category,
  progress,
}: {
  category: Category;
  progress: number;
}) => {
  return (
    <>
      <Typography variant={'h6'}>{category.name}</Typography>
      <LinearProgress variant={'determinate'} value={progress} />
    </>
  );
};

export default CategoryProgress;
