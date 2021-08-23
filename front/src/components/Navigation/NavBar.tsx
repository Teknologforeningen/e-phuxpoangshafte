import React, { useState } from 'react';

import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';

import * as CategorySelector from '../../selectors/CategorySelectors';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { Routes, userRole } from '../../types';

import LogOutButton from '../routing/LogoutButton';
import SettingsIcon from '@material-ui/icons/Settings';

const NotLoggedInList = () => (
  <List>
    <Link key={'login'} href={Routes.LOGIN}>
      <ListItem key={'login'}>
        <ListItemText primary={'Logga in'} />
      </ListItem>
    </Link>
    <Link key={'signup'} href={Routes.SIGNUP}>
      <ListItem key={'signup'}>
        <ListItemText primary={'Registrera dig'} />
      </ListItem>
    </Link>
  </List>
);

const AdminList = () => <List></List>;

const NavBar = () => {
  const classes = useStyles();
  const categoriesState = useSelector(CategorySelector.allCategories);
  const auth = useSelector(AuthSelector.auth);
  const [drawerOpen, toggleDrawer] = useState<boolean>(false);
  const anchor = 'left';

  const ListOfCategories: JSX.Element[] = !!categoriesState.categories.length
    ? categoriesState.categories
        .filter(cat => cat.events && cat.events.length > 0)
        .map(cat => (
          <Link
            key={cat.id}
            href={Routes.CATEGORY + `/${cat.id}`}
            variant={'inherit'}
          >
            <ListItem key={cat.id}>
              <ListItemText primary={cat.name} />
            </ListItem>
          </Link>
        ))
    : [<></>];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              toggleDrawer(!drawerOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Phuxpoängs häfte</Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <Box className={classes.sideBar}>
          {auth.userIsAutharized ? (
            <Box>
              <ListItem key={'root'}>
                <ListItemText
                  primary={
                    auth.userInfo?.firstName + ' ' + auth.userInfo?.lastName
                  }
                />
              </ListItem>
              <Divider />
              <Box textAlign="center">Kategorier:</Box>
              <List>{ListOfCategories}</List>
            </Box>
          ) : (
            <NotLoggedInList />
          )}
          {auth.userInfo && auth.userInfo.role === userRole.ADMIN ? (
            <>
              <Divider />
              <AdminList />
            </>
          ) : (
            <></>
          )}
          {auth.userIsAutharized && (
            <List>
              <ListItem key={'logout'}>
                <LogOutButton handleClose={() => toggleDrawer(false)} />
              </ListItem>
              <ListItem key={'settings'}>
                <Link
                  key={'settings'}
                  href={Routes.USER_SETTINGS}
                  variant={'inherit'}
                >
                  <SettingsIcon />
                </Link>
              </ListItem>
            </List>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideBar: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }),
);

export default NavBar;
