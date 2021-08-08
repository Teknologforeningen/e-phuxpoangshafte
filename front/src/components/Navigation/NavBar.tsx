import React, { useState } from 'react';

import { AppBar, Box, Divider, IconButton, List, ListItem, ListItemText, SwipeableDrawer, Toolbar, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';

import * as CategorySelector from '../../selectors/CategorySelectors'
import * as AuthSelector from '../../selectors/AuthSelectors'

const NavBar = () => {
  const categoriesState = useSelector(CategorySelector.allCategories)
  const auth = useSelector(AuthSelector.auth)
  const [drawerOpen, toggleDrawer] = useState<boolean>(false)
  const anchor = 'left'

  const ListOfCategories = categoriesState.categories !== undefined ?
  categoriesState.categories.filter(cat => cat.events && cat.events.length > 0).map( cat => 
  /*<Link 
    component={CategoryPage}
    to={Routes.SPECIFIC_CATEGORY}
    render={(RouteProps: RouteComponentProps<{category: string;}>, => {const {category} = routeProps.match.params;}>*/
    <ListItem key={cat.id}>
      <ListItemText primary={cat.name} />
    </ListItem>
  /*</Link>*/)
  : <React.Fragment></React.Fragment>
  
  return(
  <Box>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {toggleDrawer(!drawerOpen)}}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          Phuxpoängs häfte
        </Typography>
      </Toolbar>
    </AppBar>
    <SwipeableDrawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <ListItem key={'root'}>
          <ListItemText primary={auth.userInfo?.firstName + " " + auth.userInfo?.lastName} />
        </ListItem>
      <Divider/>
      <Box textAlign = 'center'>Kategorier:</Box>
      <List>
        {ListOfCategories}
      </List>
      </SwipeableDrawer>
  </Box>
  )
} 

/*const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    maxWidth: 300,
  },
  redLabel: {
    color: theme.palette.secondary.main
  }
}))*/

export default NavBar