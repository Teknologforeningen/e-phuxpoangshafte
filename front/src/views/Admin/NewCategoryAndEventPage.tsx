import React, { useState } from 'react';
import { AppBar, Box, Tab, Tabs, Theme, Typography } from '@mui/material';
import NewCategoryForm from './components/NewCategoryForm';
import NewEventForm from './components/NewEventForm';
import EditEventForm from './components/EditEventForm';
import EditCategoryForm from './components/EditCategoryForm';
import { makeStyles } from '@mui/styles';

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
      <AppBar position="static" className={classes.bar}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Lägg till kategori" {...a11yProps(0)} />
          <Tab label="Lägg till poäng" {...a11yProps(1)} />
          <Tab label="Ändra/Ta bort kategori" {...a11yProps(2)} />
          <Tab label="Ändra/Ta bort poäng" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
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
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
  },
  bar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default NewCatAndEventPage;
