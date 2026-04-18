import React, { useState } from 'react';
import { Box, Tab, Tabs, Theme, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';

import NewCategoryForm from './components/NewCategoryForm';
import NewEventForm from './components/NewEventForm';
import EditEventForm from './components/EditEventForm';
import EditCategoryForm from './components/EditCategoryForm';
import SiteSettingsForm from './components/SiteSettingsForm';
import AdminLayout from './components/AdminLayout';

export const maxWidthAdminForms = 600;

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={4} pb={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NewCatAndEventPage = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AdminLayout
      title="Hantera Kategorier och Poäng"
      description="Lägg till, ändra eller ta bort poänghändelser och kategorier för hela plattformen."
      maxWidth="md"
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="admin form tabs"
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          className={classes.tabs}
        >
          <Tab label="Lägg till kategori" {...a11yProps(0)} />
          <Tab label="Lägg till poäng" {...a11yProps(1)} />
          <Tab label="Ändra / Ta bort kategori" {...a11yProps(2)} />
          <Tab label="Ändra / Ta bort poäng" {...a11yProps(3)} />
          <Tab label="Inställningar" {...a11yProps(4)} />
        </Tabs>
        <Divider />

        <Box display="flex" justifyContent="center">
          <Box width="100%" maxWidth={maxWidthAdminForms}>
            <TabPanel value={value} index={0}>
              <NewCategoryForm />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <NewEventForm />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <EditCategoryForm />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <EditEventForm />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <SiteSettingsForm />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    marginBottom: theme.spacing(1),
    '& .MuiTabs-indicator': {
      height: 3,
      borderRadius: '3px 3px 0 0',
      backgroundColor: theme.palette.secondary.main,
    },
    '& .MuiTab-root': {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.95rem',
      color: '#718096',
      '&.Mui-selected': {
        color: theme.palette.secondary.main,
      },
    },
  },
}));

export default NewCatAndEventPage;
