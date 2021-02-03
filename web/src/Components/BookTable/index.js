import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});


export default function BookTable({ data }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell className={classes.header} >Title</TableCell>
            <TableCell className={classes.header} >Authors</TableCell>
            <TableCell className={classes.header} >Genres</TableCell>
            <TableCell className={classes.header} >Pages</TableCell>
            <TableCell className={classes.header} >Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.id}>
              <TableCell> {book.title} </TableCell>
              <TableCell> {book.authors.join(', ')} </TableCell>
              <TableCell> {book.genres.join(', ')} </TableCell>
              <TableCell> {book.pages} </TableCell>
              <TableCell> 🌟 {book.rating} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
