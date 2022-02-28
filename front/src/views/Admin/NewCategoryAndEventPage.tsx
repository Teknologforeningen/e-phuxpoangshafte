import React, { useState } from 'react';
import { AppBar, Box, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import NewCategoryForm from './components/NewCategoryForm';
import NewEventForm from './components/NewEventForm';
import EditEventForm from './components/EditEventForm';
import EditCategoryForm from './components/EditCategoryForm';
import { makeStyles } from '@material-ui/styles';

//TabPanel taken directly from Mui documenation

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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const NewCatAndEventPage = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className={classes.tabs}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Lägg till kategori" {...a11yProps(0)} />
          <Tab label="Lägg till poäng" {...a11yProps(1)} />
          <Tab label="Lägg till servi" {...a11yProps(2)} />
          <Tab label="Ändra/Ta bort kategori" {...a11yProps(3)} />
          <Tab label="Ändra/Ta bort poäng" {...a11yProps(4)} />
          <Tab label="Ändra/Ta bort servi" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <NewCategoryForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NewEventForm />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <NewEventForm />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EditCategoryForm />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <EditEventForm />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <EditEventForm />
      </TabPanel>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
  },
  selected: {
    color: theme.palette.primary.main,
  },
}));

export default NewCatAndEventPage;
