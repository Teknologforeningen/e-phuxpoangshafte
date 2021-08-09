import React from 'react';

import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Link,
  Divider,
} from '@material-ui/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as CategorySelector from '../../selectors/CategorySelectors';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { Routes } from '../../types';
import CategoryPage from '../../views/CategoryPage';
import MemberDashboard from '../../views/MemberDashboard';

const LeftDrawer = () => {
  const categoriesState = useSelector(CategorySelector.allCategories);
  const auth = useSelector(AuthSelector.auth);
  const [drawerOpen, toggleDrawer] = useState<boolean>(false);
  const anchor = 'left';

  const ListOfCategories =
    categoriesState.categories !== undefined ? (
      categoriesState.categories
        .filter(cat => cat.events && cat.events.length > 0)
        .map(
          cat => (
            /*<Link 
    component={CategoryPage}
    to={Routes.SPECIFIC_CATEGORY}
    render={(RouteProps: RouteComponentProps<{category: string;}>, => {const {category} = routeProps.match.params;}>*/
            <ListItem key={cat.id}>
              <ListItemText primary={cat.name} />
            </ListItem>
          ),
          /*</Link>*/
        )
    ) : (
      <React.Fragment></React.Fragment>
    );

  return (
    <Box>
      <SwipeableDrawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <ListItem key={'root'}>
          <ListItemText
            primary={auth.userInfo?.firstName + ' ' + auth.userInfo?.lastName}
          />
        </ListItem>
        <Divider />
        <Box textAlign="center">Kategorier:</Box>
        <List>{ListOfCategories}</List>
      </SwipeableDrawer>
    </Box>
  );
};

export default LeftDrawer;
