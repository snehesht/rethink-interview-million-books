import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SearchBar from '../../Components/SearchBar'
import BooksTable from '../../Components/BookTable';

let searchEndpoint = '/api/v1/books';
if (process.env.NODE_ENV !== 'production') {
  searchEndpoint = 'http://localhost:8000/api/v1/books'
} else {
  searchEndpoint = `${window.location.protocol}//${window.location.host}/api/v1/books`
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(5),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  search: {
    magrinTop: theme.spacing(5),
  },
  books: {
    magrinTop: theme.spacing(5),
  }
}));

export default function App() {
  const classes = useStyles();
  const [query, setQuery] = React.useState('');
  const [book, setBooks] = React.useState([]);

  const handleSearchChange = function(event) {
    setQuery(event.target.value)
    fetchBooks(query)
  }

  const fetchBooks = async (query, limit=15, offset=0) => {
    return await fetch(`${searchEndpoint}?query=${query}&limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data);
      })
      .catch(error => {
        setBooks([])
      })
  };

  useEffect(() => { fetchBooks(query, 15, 0) }, [query, 15, 0]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="lg">
        
        <Grid container spacing={6} direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h3" component="h3" colorprimary >Books</Typography>
          </Grid>
          <Grid item xs={12}>
            <SearchBar
              query={query}
              handleChange={handleSearchChange}
              className={classes.search}
            />
          </Grid>
          <Grid item xs={12}>
            <BooksTable className={classes.books} data={book}/>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
