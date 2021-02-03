import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    // marginTop: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    minWidth: 600,
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  searchIcon: {
    marginRight: theme.spacing(2),
  }
}));

const SearchBar = ({ query, handleChange }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} direction="row" justify="center" alignItems="center">
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search Books"
          inputProps={{ 'aria-label': 'search books' }}
          onChange={handleChange}
          value={query}
        />
        <SearchIcon className={classes.searchIcon}/>
      </Paper>
    </Grid>
  );
}

export default SearchBar;