import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Box, CircularProgress, Grid, Container, Paper } from '@material-ui/core';

import { homeActions } from './homeSlice';
import HomePageHeaderMap from '../../Components/Home/HomePageHeaderMap';
import ViewEventListDetails from '../../Components/ViewEventsListDetails/ViewEventListDetails';
import CreateNewEventCta from '../../Components/ViewEventListCta/CreateNewEventCta';
import NavigateProfileFromEventCta from '../../Components/ViewEventListCta/NavigateProfileFromEventCta';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem auto',
    minHeight: '100%',
    backgroundColor: theme.palette.secondary.main,
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, events } = useSelector((state) => state.home);
  const currentEvents = !loading && events;

  useEffect(() => {
    dispatch(homeActions.getUsername());
    dispatch(homeActions.getEvents());
    dispatch(homeActions.getCauseList());
    dispatch(homeActions.getProjectTypes());
    dispatch(homeActions.getAllStatesUS());
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <Box className={classes.spinnerContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <CreateNewEventCta />
          </Paper>
          <Paper>
            <NavigateProfileFromEventCta />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <HomePageHeaderMap eventList={currentEvents} />
        </Grid>
        <Grid item xs={12}>
          <ViewEventListDetails currentEvents={currentEvents} loading={loading} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
