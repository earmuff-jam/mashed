import PropTypes from 'prop-types';
import classNames from 'classnames';
import steps from '../../tour/steps';
import { useTour } from '@reactour/tour';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Paper, Typography } from '@mui/material';
import { authActions } from '../../Containers/Auth/authSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AppBarNavListItem from './AppBarNavListItem';
import {
  AssignmentIndRounded,
  ContactSupportRounded,
  HomeRounded,
  LockOpenRounded,
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0),
    overflow: 'auto',
    backgroundColor: theme.palette.common.white,
  },
  headerText: {
    fontSize: '2.0rem',
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.primary.main,
  },
  text: {
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.primary.main,
    fontSize: '0.925rem',
  },
  iconStyle: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  underline: {
    borderBottom: `${theme.spacing(0.02)}rem ${theme.palette.warning.main} solid`,
  },
  logo: {
    display: 'flex',
    alignSelf: 'end',
    width: '1rem',
    height: '1rem',
    paddingBottom: '0.3rem',
    color: theme.palette.primary.main,
  },
  leftAside: {
    flexGrow: 1,
  },
  navListComponent: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  primaryStyle: {
    color: theme.palette.primary.dark,
  },
}));

const PrimaryAppBar = ({ selectedID, title, elevation }) => {
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
      description: 'Home Page',
      icon: <HomeRounded />,
      display: true,
      to: '/',
    },
    {
      id: 2,
      displayName: 'Profile',
      description: 'Profile Page',
      icon: <AssignmentIndRounded />,
      display: true,
      to: '/profile',
    },
    {
      id: 3,
      displayName: 'Help',
      description: 'Help with this page',
      icon: <ContactSupportRounded />,
      display: selectedID === 1,
    },
    {
      id: 4,
      displayName: 'Logoff',
      description: 'Logout',
      icon: <LockOpenRounded />,
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
      '/': { start: 0, end: 7 },
      '/about': { start: 7, end: 9 },
      '/profile': { start: 9, end: 13 },
      '/eventID': { start: 13, end: 26 },
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
    <Paper elevation={elevation} className={classes.root}>
      <Typography variant="h5" color="primary" sx={{ fontSize: '1.785rem' }}>
        {title}
      </Typography>
      <Box className={classes.leftAside}></Box>
      <Box className={classes.navListComponent}>
        {NAVIGATION_MENU_BAR.map((el) => (
          <AppBarNavListItem
            key={el.id}
            title={el.displayName}
            tooltipTitle={el.description}
            icon={el.icon}
            iconStyle={classNames(classes.iconStyle, {
              [classes.primaryStyle]: el.id === selectedID,
            })}
            onClick={() => handleNavigation(el)}
            titleStyle={classNames(classes.text, {
              [classes.underline]: el.id === selectedID,
            })}
          />
        ))}
      </Box>
    </Paper>
  );
};

PrimaryAppBar.defaultProps = {
  title: 'AssetAlert',
  titleVariant: 'h5',
  elevation: 0,
  selectedID: 0,
};

PrimaryAppBar.propTypes = {
  title: PropTypes.string,
  titleVariant: PropTypes.string,
  elevation: PropTypes.number,
  selectedID: PropTypes.number,
};

export default PrimaryAppBar;
