import React from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Box, List, ListItem, Paper, Tooltip, Typography } from '@material-ui/core';

import steps from '../../tour/steps';
import { useTour } from '@reactour/tour';
import { useDispatch } from 'react-redux';

import { authActions } from '../../Containers/Auth/authSlice';
import { LiveHelpRounded, LockOpenRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  rootPaddingLeft: {
    paddingLeft: theme.spacing(4),
  },
  leftAside: {
    flexGrow: 1,
  },
  fontVariation: {
    color: theme.palette.primary.main,
    fontSize: '1.125rem',
    fontFamily: 'Poppins, sans-serif',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.925rem',
    },
  },
  underline: {
    borderBottom: `${theme.spacing(0.02)}rem ${theme.palette.warning.main} solid`,
  },
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0, 1),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: '2.0rem',
    letterSpacing: '0.125rem',
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  logo: {
    marginLeft: theme.spacing(0.1),
    marginTop: theme.spacing(1),
    width: '1rem',
    height: '1rem',
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
      width: '2rem',
      height: '2rem',
    },
  },
}));

const PrimaryAppBar = (props) => {
  const { selectedID } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventID } = useParams();

  const { setIsOpen, setCurrentStep, setSteps } = useTour();

  const NAVIGATION_MENU_BAR = [
    {
      id: 1,
      displayName: 'Home',
      display: true,
      to: '/',
    },
    {
      id: 2,
      displayName: 'Profile',
      display: true,
      to: '/profile',
    },
    {
      id: 3,
      displayName: <LiveHelpRounded />,
      description: 'Help with this page',
      display: selectedID === 1,
    },
    {
      id: 4,
      displayName: <LockOpenRounded />,
      description: 'Logout',
      to: '/out',
    },
  ];

  const handleNavigation = (el) => {
    if (el?.to === '/out') {
      handleLogout();
    } else {
      el?.to ? redirect(el.to) : setTour();
    }
  };

  const redirect = (to) => {
    navigate(to);
  };

  const setTour = () => {
    const stepMap = {
      '/': { start: 0, end: 6 },
      '/about': { start: 6, end: 8 },
      '/profile': { start: 8, end: 10 },
      '/eventID': { start: 10, end: 23 },
    };
    const currentStep = eventID ? stepMap['/eventID'] : stepMap[location.pathname];
    const formattedSteps = steps.slice(currentStep.start, currentStep.end);
    setIsOpen(true);
    setCurrentStep(0);
    setSteps(formattedSteps);
  };

  const handleLogout = () => {
    dispatch(authActions.getLogout());
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.appBar}>
        <Box className={classes.header}>
          <Typography variant="h6" className={classes.headerText}>
            Mashed
          </Typography>
          <img src={'mashed-logo.png'} className={classes.logo} alt="company logo" />
        </Box>
        <Box className={classes.leftAside}></Box>
        {NAVIGATION_MENU_BAR.map((el) => (
          <List key={el.id} component="nav" aria-labelledby="nested-list-subheader">
            <ListItem button onClick={() => handleNavigation(el)}>
              <Tooltip title={el.description || el.displayName}>
                <Typography
                  className={classNames(classes.fontVariation, {
                    [classes.underline]: el.id === selectedID,
                  })}
                >
                  {el.displayName}
                </Typography>
              </Tooltip>
            </ListItem>
          </List>
        ))}
      </Paper>
    </div>
  );
};

export default PrimaryAppBar;
