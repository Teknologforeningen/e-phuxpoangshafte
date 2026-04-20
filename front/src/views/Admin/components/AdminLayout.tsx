import React, { ReactNode } from 'react';
import {
  Box,
  Card,
  Container,
  Divider,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const AdminLayout = ({
  children,
  title,
  description,
  maxWidth = false,
}: AdminLayoutProps) => {
  const classes = useStyles();

  return (
    <Container maxWidth={maxWidth} className={classes.root}>
      <Card className={classes.card} elevation={0}>
        <Box mb={2}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            className={classes.title}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{ color: '#718096', maxWidth: '800px' }}
            >
              {description}
            </Typography>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box className={classes.content}>{children}</Box>
      </Card>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // AppRouter already adds marginTop: navBarHeight + 5, so we reduce this
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(3), // Slightly less at the top of card
    borderRadius: theme.spacing(3), // More rounded corners
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', // Subtle, premium shadow
  },
  title: {
    fontWeight: 800,
    color: '#1a202c', // Solid dark color for visibility
    letterSpacing: '-0.025em',
  },
  content: {
    width: '100%',
  },
}));

export default AdminLayout;
