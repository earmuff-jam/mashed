import { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import Title from '../DialogComponent/Title';
import ViewExpenseList from './ViewExpenseList';
import AddExpenseDetail from './AddExpenseDetail';
import Drawer from '../DrawerListComponent/Drawer';
import { eventActions } from '../../Containers/Event/eventSlice';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  text: {
    color: theme.palette.primary.main,
    fontSize: '0.725rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Roboto',
  },
}));

const ExpenseDetails = ({ eventID, userID, editingAllowed }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false); // display for drawer

  const toggleDrawer = (boolVal) => setOpenDrawer(boolVal);

  const handleViewExpenses = () => {
    setOpenDrawer(true);
    dispatch(eventActions.getExpenseList({ eventID }));
  };

  const handleAddExpenses = () => {
    setOpenDialog(true);
    dispatch(eventActions.getCategoryList());
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.rowContainer}>
        <ButtonComponent
          disabled={editingAllowed}
          onClick={handleAddExpenses}
          buttonStyles={classes.text}
          text={'Add Expenses'}
          buttonVariant={'text'}
        />
        <ButtonComponent
          onClick={handleViewExpenses}
          buttonStyles={classes.text}
          text={'View Expenses'}
          buttonVariant={'text'}
        />
      </Box>
      <Drawer open={openDrawer} toggleDrawer={toggleDrawer} disabled={editingAllowed}>
        <ViewExpenseList disabled={true} />
      </Drawer>
      <Dialog open={openDialog} width={'md'} fullWidth={true}>
        <Title onClose={() => setOpenDialog(false)}>Add New Expense</Title>
        <AddExpenseDetail eventID={eventID} userID={userID} setDisplayMode={() => setOpenDialog(false)} />
      </Dialog>
    </Box>
  );
};

ExpenseDetails.defaultProps = {
  eventID: '',
  userID: '',
  editingAllowed: false,
};

ExpenseDetails.propTypes = {
  eventID: PropTypes.string,
  userID: PropTypes.string,
  editingAllowed: PropTypes.bool,
};

export default ExpenseDetails;
