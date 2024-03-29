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
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import * as Themes from '../../styles/themes';
import { createStyles, makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import * as CategorySelector from '../../selectors/CategorySelectors';
import { auth } from '../../selectors/AuthSelectors';
import { Category, Routes, UserRole } from '../../types';

import LogOutButton from '../routing/LogoutButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TFLogoSVG from '../../styles/img/TFlogo';
import classNames from 'classnames';

const NotLoggedInList = () => {
  const classes = useStyles();
  return (
    <List>
      <Link key={'login-link'} href={Routes.LOGIN}>
        <ListItem key={'login'}>
          <ListItemText
            primary={'Logga in'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link key={'signup-link'} href={Routes.SIGNUP}>
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
      <Link key={'admin-link'} href={Routes.ADMIN} variant={'inherit'}>
        <ListItem key={'admin'}>
          <ListItemText
            primary={'Användartabell'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link
        key={'admin-summary'}
        href={Routes.ADMIN_SUMMARY}
        variant={'inherit'}
      >
        <ListItem key={'admin_summary'}>
          <ListItemText
            primary={'Sammanställning'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link
        key={'requests-link'}
        href={Routes.ADMIN_REQUESTS}
        variant={'inherit'}
      >
        <ListItem key={'requests'}>
          <ListItemText
            primary={'Förfrågningar'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
      <Link
        key={'addmore-link'}
        href={Routes.ADMIN_ADDMORE}
        variant={'inherit'}
      >
        <ListItem key={'addmore'}>
          <ListItemText
            primary={'Kategorier och poäng'}
            className={classes.categoryLinks}
          />
        </ListItem>
      </Link>
    </List>
  );
};

const getNavbarTitle = (
  location: string,
  userIsAutharized: boolean | null,
  categories: Category[],
): string => {
  if (userIsAutharized) {
    if (location === Routes.ROOT) {
      return 'Hem';
    }
    if (location.includes('kategori')) {
      const locationSplits = location.split('/');
      const kategoriId = parseInt(locationSplits[locationSplits.length - 1]);
      return (
        categories.find(category => category.id === kategoriId)?.name ?? ''
      );
    }
    if (location === Routes.USER_SETTINGS) {
      return 'Inställningar';
    }
    if (location === Routes.INSTRUCTIONS) {
      return 'Reglemente';
    }
  }
  return '';
};

const NavBar = () => {
  const classes = useStyles();
  const categoriesState = useSelector(CategorySelector.allCategories);
  const authentication = useSelector(auth);
  const [drawerOpen, toggleDrawer] = useState<boolean>(false);
  const anchor = 'left';

  const isBrowser = typeof window !== 'undefined';
  const iOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMdUp = useMediaQuery(Themes.theme.breakpoints.up('md'));

  const location = useLocation();

  const navbarTitle = getNavbarTitle(
    location.pathname,
    authentication.userIsAutharized,
    categoriesState.categories,
  );

  const ListOfCategories: JSX.Element[] = !!categoriesState.categories.length
    ? categoriesState.categories
        .filter(cat => cat.events && cat.events.length > 0)
        .map(cat => (
          <Link
            key={`${cat.id}-link`}
            href={Routes.CATEGORY + `/${cat.id}`}
            variant={'inherit'}
          >
            <ListItem key={`${cat.name}-name`}>
              <ListItemText
                primary={cat.name}
                className={classes.categoryLinks}
              />
            </ListItem>
          </Link>
        ))
    : [<></>];

  return (
    <Box width={isMdUp ? 205 : undefined} className={classes.flex}>
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
            <TFLogoSVG className={classes.logo} />
          </IconButton>
          <Box className={classes.navBarSpacer}>
            {
              <Typography variant="body2" textAlign="center">
                {navbarTitle}
              </Typography>
            }
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
          {authentication.userIsAutharized ? (
            <Box textAlign="center">
              <List>
                <ListItem key="home">
                  <Link key={'home-link'} href={Routes.ROOT}>
                    <ListItemText
                      primary={'Hem'}
                      className={classes.categoryLinks}
                    />
                  </Link>
                </ListItem>
                <ListItem key="instructions">
                  <Link key={'instructions-link'} href={Routes.INSTRUCTIONS}>
                    <ListItemText
                      primary={'Reglemente'}
                      className={classes.categoryLinks}
                    />
                  </Link>
                </ListItem>
              </List>
              <Divider />
              <List>{ListOfCategories}</List>
              {authentication.userInfo?.role === UserRole.ADMIN ? (
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

          {authentication.userIsAutharized && (
            <List>
              <ListItem key={'settings'}>
                <Link
                  key={'settings-link'}
                  href={Routes.USER_SETTINGS}
                  className={classes.flex}
                >
                  <SettingsIcon
                    className={classNames(
                      classes.settingsIcon,
                      classes.iconListItem,
                    )}
                  />
                  <Typography className={classes.settingsIcon}>
                    Inställningar
                  </Typography>
                </Link>
              </ListItem>
              <ListItem
                key={'logout'}
                className={classNames(classes.flex, classes.alignStart)}
              >
                <Box className={classes.iconListItem}>
                  <LogOutButton handleClose={() => toggleDrawer(false)} />
                </Box>
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

const useStyles = makeStyles(
  (theme: Theme) =>
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
        justifyContent: 'center',
        marginRight: theme.spacing(5),
      },
      topPadding: {
        paddingTop: navBarHeight + 5,
      },
      logo: {
        fill: 'white',
        width: 42,
      },
      settingsIcon: {
        color: theme.palette.primary.contrastText,
      },
      alignStart: {
        alignItems: 'flex-start',
      },
      iconListItem: {
        marginRight: theme.spacing(1),
      },
    }),
  { index: 1 },
);

export default NavBar;
