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
import { NavLink } from 'react-router-dom';

import LogOutButton from '../routing/LogoutButton';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CategoryIcon from '@mui/icons-material/Category';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
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
  const location = useLocation();

  const adminLinks = [
    { label: 'Sammanställning', path: Routes.ADMIN, icon: <SummarizeIcon /> },
    {
      label: 'Kategorier och poäng',
      path: Routes.ADMIN_ADDMORE,
      icon: <CategoryIcon />,
    },
  ];

  return (
    <List>
      {adminLinks.map(link => (
        <ListItem
          key={link.path}
          component={NavLink}
          to={link.path}
          className={classNames(classes.navItem, {
            [classes.navItemActive]: location.pathname === link.path,
          })}
        >
          <Box className={classes.navIcon}>{link.icon}</Box>
          <ListItemText primary={link.label} />
        </ListItem>
      ))}
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
        .map(cat => {
          const path = Routes.CATEGORY + `/${cat.id}`;
          return (
            <ListItem
              key={cat.id}
              component={NavLink}
              to={path}
              className={classNames(classes.navItem, {
                [classes.navItemActive]: location.pathname === path,
              })}
            >
              <Box className={classes.navIcon}>
                <TaskAltIcon />
              </Box>
              <ListItemText primary={cat.name} />
            </ListItem>
          );
        })
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
                <ListItem
                  key="home"
                  component={NavLink}
                  to={Routes.ROOT}
                  className={classNames(classes.navItem, {
                    [classes.navItemActive]: location.pathname === Routes.ROOT,
                  })}
                >
                  <Box className={classes.navIcon}>
                    <HomeIcon />
                  </Box>
                  <ListItemText primary={'Hem'} />
                </ListItem>
                <ListItem
                  key="instructions"
                  component={NavLink}
                  to={Routes.INSTRUCTIONS}
                  className={classNames(classes.navItem, {
                    [classes.navItemActive]:
                      location.pathname === Routes.INSTRUCTIONS,
                  })}
                >
                  <Box className={classes.navIcon}>
                    <GavelIcon />
                  </Box>
                  <ListItemText primary={'Reglemente'} />
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
              <ListItem
                key={'settings'}
                component={NavLink}
                to={Routes.USER_SETTINGS}
                className={classNames(classes.navItem, {
                  [classes.navItemActive]:
                    location.pathname === Routes.USER_SETTINGS,
                })}
              >
                <Box className={classes.navIcon}>
                  <SettingsIcon />
                </Box>
                <ListItemText primary={'Inställningar'} />
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
      navItem: {
        margin: theme.spacing(0.5, 1),
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.spacing(1.5),
        color: '#718096',
        textDecoration: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiListItemText-primary': {
          fontSize: '0.9rem',
        },
        '&:hover': {
          backgroundColor: '#f1f5f9',
          color: theme.palette.secondary.main,
          '& $navIcon': {
            color: theme.palette.secondary.main,
          },
        },
      },
      navItemActive: {
        backgroundColor: `${theme.palette.secondary.main}12`, // Very soft red tint
        color: theme.palette.secondary.main,
        '& $navIcon': {
          color: theme.palette.secondary.main,
        },
        '& .MuiTypography-root': {
          fontWeight: 700,
        },
      },
      navIcon: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1.5),
        color: '#a0aec0',
        transition: 'color 0.2s',
        '& svg': {
          fontSize: '1.25rem',
        },
      },
      sideBar: {
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          borderRight: '1px solid #edf2f7',
        },
      },
      categoryLinks: {
        color: theme.palette.primary.contrastText,
      },
      sideBarSpacer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing(2),
      },
      navbar: {
        backgroundColor: theme.palette.secondary.main,
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        height: navBarHeight,
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
      },
      navBarSpacer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: theme.spacing(5),
      },
      topPadding: {
        paddingTop: navBarHeight + 10,
      },
      logo: {
        fill: 'white',
        width: 36,
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
