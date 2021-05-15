
import React, {useRef} from "react";
import { Link, NavLink } from "react-router-dom";
import { AppBar, Toolbar, IconButton, makeStyles, Container, List, ListItem, ListItemText, Box, Grid } from "@material-ui/core";
import { Home } from "@material-ui/icons";

const useStyles = makeStyles({
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
      },
    navDisplayFlex: {
      display: `flex`,
      justifyContent: `space-between`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`
    }, 
    linkTextHover: {
      color: "white"
    },
    partyshortcut: {
      display: "flex", 
      alignItems: "stretch",
      flexDirection: "row", 
      justifyContent: "center"
    }
  });
const navLinks = [
     { title: `home`, path: `/` },
     { title: `login`, path: `/account/login/` },
     { title: `signup`, path: `/account/signup` },
      { title: `logout`, path: `/account/logout/` },


  ]

export const Navbar = (props) => {

    const classes = useStyles(); // Add this

    
    return (
        <AppBar position="static">
      <Toolbar>
        <Container className={classes.navbarDisplayFlex}>

        <IconButton edge="start" color="inherit" aria-label="home">
          <Home fontSize="large" />
        </IconButton>
        <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
           
            {navLinks.map(({ title, path }) => (
            <NavLink to={path} key={title} className={classes.linkText} style={{color: "white"}} >
                <ListItem button>
                <ListItemText primary={title} />
                </ListItem>
            </NavLink>
            ))}

        </List>
        </Container>
      </Toolbar>
    </AppBar>
        
    )
}