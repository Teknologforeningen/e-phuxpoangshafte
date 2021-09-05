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
  useMediaQuery,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Theme } from '@material-ui/core/styles';
import * as Themes from '../../styles/themes';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import { useSelector } from 'react-redux';

import * as CategorySelector from '../../selectors/CategorySelectors';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { Routes, userRole } from '../../types';

import LogOutButton from '../routing/LogoutButton';
import SettingsIcon from '@material-ui/icons/Settings';
import TFLogoSVG from '../../styles/img/TFlogo';

const NotLoggedInList = () => {
  const classes = useStyles();
  return (
    <List>
      <Link key={'login'} href={Routes.LOGIN}>
        <ListItem key={'login'}>
          <ListItemText
            primary={'Logga in'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link key={'signup'} href={Routes.SIGNUP}>
        <ListItem key={'signup'}>
          <ListItemText
            primary={'Registrera dig'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
    </List>
  );
};

const AdminList = () => {
  const classes = useStyles();
  return (
    <List>
      <Link key={'admin'} href={Routes.ADMIN} variant={'inherit'}>
        <ListItem key={'admin'}>
          <ListItemText
            primary={'Användar tabel'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link key={'requests'} href={Routes.ADMIN_REQUESTS} variant={'inherit'}>
        <ListItem key={'requests'}>
          <ListItemText
            primary={'Förfrågningar'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link key={'addmore'} href={Routes.ADMIN_ADDMORE} variant={'inherit'}>
        <ListItem key={'addmore'}>
          <ListItemText
            primary={'Categorier och poäng'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
    </List>
  );
};

const NavBar = () => {
  const classes = useStyles();
  //const theme = useTheme();
  const categoriesState = useSelector(CategorySelector.allCategories);
  const auth = useSelector(AuthSelector.auth);
  const [drawerOpen, toggleDrawer] = useState<boolean>(false);
  const anchor = 'left';

  const isBrowser = typeof window !== 'undefined';
  const iOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMdUp = useMediaQuery(Themes.theme.breakpoints.up('md'));

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
              <ListItemText
                primary={cat.name}
                className={classes.categoryLinks}
              />
            </ListItem>
          </Link>
        ))
    : [<></>];

  return (
    <Box className={classes.flex}>
      <AppBar position="fixed" className={classes.navbar}>
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
          {/* TODO: Check why margin un aligns stuff and chekc if fill can be primary  */}
          <Box
            className={classes.navBarSpacer}
            marginTop={'46.6px'}
            marginBottom={'46.6px'}
          >
            {/*<Typography
              variant="h6"
              marginTop={'46.6px'}
              marginBottom={'46.6px'}
            >
            Phuxpoängshäfte
            </Typography>*/}
            <Link key={'root'} href={Routes.ROOT} variant={'inherit'}>
              <TFLogoSVG className={classes.logo} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        className={classes.sideBar}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        variant={isMdUp ? 'permanent' : 'temporary'}
      >
        <Box className={classes.topPadding}></Box>
        <Box className={classes.sideBarSpacer}>
          {auth.userIsAutharized ? (
            <Box textAlign="center">
              <ListItem key={'root'}>
                <ListItemText
                  primary={
                    auth.userInfo?.firstName + ' ' + auth.userInfo?.lastName
                  }
                />
              </ListItem>
              <Divider />
              <List>{ListOfCategories}</List>
              {auth.userInfo && auth.userInfo.role === userRole.ADMIN ? (
                <>
                  <Divider />
                  <AdminList />
                </>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <NotLoggedInList />
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
                  <SettingsIcon color={'inherit'} />
                </Link>
              </ListItem>
            </List>
          )}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export const navBarHeight = 60;
export const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: 'flex',
    },
    sideBar: {
      color: theme.palette.primary.contrastText,
    },
    categoryLinks: {
      color: theme.palette.primary.contrastText,
    },
    sideBarSpacer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    navbar: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
      zIndex: theme.zIndex.drawer + 1,
      height: navBarHeight,
    },
    navBarSpacer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    topPadding: {
      paddingTop: navBarHeight + 5,
    },
    logo: {
      fill: 'white',
      width: 42,
    },
  }),
);

export default NavBar;
