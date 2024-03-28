import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import DownloadExcelButton from '../ItemDetail/DownloadExcelButton';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    maxHeight: '40vh',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: '2.0rem',
    letterSpacing: '0.125rem',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.primary.main,
  },
  text: {
    fontSize: '0.925rem',
    fontWeight: 'lighter',
    color: theme.palette.error.dark,
    margin: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const List = ({
  title,
  subtitle,
  data,
  filteredData,
  columns,
  columnHeaderFormatter,
  rowFormatter,
  tooltipTitle,
  fileName,
  sheetName,
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.headerText}>{title}</Typography>
      <Box className={classes.container}>
        <Box className={classes.rowContainer}>
          <Typography className={classes.text}>{subtitle}</Typography>
          {data.length > 0 && (
            <DownloadExcelButton data={data} tooltipTitle={tooltipTitle} fileName={fileName} sheetName={sheetName} />
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column} className={classes.tableHeaderCell}>
                    {columnHeaderFormatter(column)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column}>{rowFormatter(row, column, rowIndex)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

List.defaultProps = {
  title: '',
  subtitle: '',
  data: [],
  filteredData: [],
  columns: [],
  columnHeaderFormatter: () => {},
  rowFormatter: () => {},
  tooltipTitle: '',
  fileName: '',
  sheetName: '',
};

List.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  data: PropTypes.array,
  filteredData: PropTypes.array,
  columns: PropTypes.array,
  columnHeaderFormatter: PropTypes.func,
  rowFormatter: PropTypes.func,
  tooltipTitle: PropTypes.string,
  fileName: PropTypes.string,
  sheetName: PropTypes.string,
};

export default List;
