import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames';
import MapComponentFn from '../Map/Map';
import Host from '../HostComponent/Host';
import PieChart from '../PieChart/PieChart';
import ExpenseChart from '../PieChart/ExpenseChart';
import makeStyles from '@mui/styles/makeStyles';
import CommunityMsg from '../ChatComponent/CommunityMsg';
import { Box, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import ExpenseDetails from '../ViewExpenseList/ExpenseDetails';
import { NAVIGATION_TABS, isEditingAllowed } from './constants';
import RSVPRegistration from '../RsvpComponent/RSVPRegistration';
import ImpactTracking from '../ImpactTrackingDetails/ImpactTracking';
import ViewExpenseListHeader from '../ViewExpenseList/ViewExpenseListHeader';
import ShareItemsComponent from '../ShareItemsComponent/ShareItemsComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.secondary.main,
  },
  listItem: {
    borderRadius: theme.spacing(0.25),
    padding: theme.spacing(0.25),
    gap: theme.spacing(1),
  },
  headerText: {
    fontSize: '1.725rem',
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.error.dark,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  textIconContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileVariation: {
    fontSize: '0.925rem',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  smallVariant: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  mapRoot: {
    width: '100%',
  },
  allowSpace: {
    gap: theme.spacing(2),
  },
  underline: {
    borderBottom: `${theme.spacing(0.02)}rem ${theme.palette.warning.main} solid`,
  },
  selected: {
    color: theme.palette.warning.dark,
  },
}));

const EventDetailsDrawerComponent = ({
  eventID,
  selectedEvent,
  volunteeringActivities,
  userDetail,
  handleRSVP,
  isChecked,
  disabled,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const editingAllowed = isEditingAllowed(disabled, userDetail);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const displaySelection = (value) => {
    switch (value) {
      case 0:
        return (
          <Box className={classNames(classes.rowContainer, classes.smallVariant)}>
            <Box>
              <RSVPRegistration
                disabled={disabled}
                handleRSVP={handleRSVP}
                isChecked={userDetail.userHasRsvp || isChecked}
              />
              <ImpactTracking
                eventID={eventID}
                userID={userDetail.userID}
                requiredSkills={userDetail.requiredSkills}
                disabled={disabled}
                isChecked={userDetail.userHasRsvp || isChecked}
              />
            </Box>
            <PieChart
              volunteeringActivities={volunteeringActivities}
              totalSkillLimit={userDetail.totalAllocatedMembers || 0}
            />
          </Box>
        );
      case 1:
        return (
          <CommunityMsg
            disabled={disabled}
            userFullName={userDetail.userFullName}
            userID={userDetail.userID}
            eventID={eventID}
            isChecked={isChecked}
          />
        );
      case 2:
        return (
          <Box className={classNames(classes.rowContainer, classes.smallVariant)}>
            <Box>
              <ViewExpenseListHeader />
              <ExpenseDetails eventID={eventID} userID={userDetail.userID} editingAllowed={editingAllowed} />
            </Box>
            <ExpenseChart eventID={eventID} totalSkillLimit={0} />
          </Box>
        );
      case 3:
        return <ShareItemsComponent />;
      case 4:
        return (
          <Box>
            <Box className={classNames(classes.rowContainer, classes.smallVariant, classes.allowSpace)}>
              <Box>
                <Host selectedEvent={selectedEvent} />
              </Box>
              <Box className={classes.mapRoot}>
                <MapComponentFn shrinkSize={true} disabled={disabled} locationDetails={userDetail.location} />
              </Box>
            </Box>
            {userDetail?.isCreator ? (
              <>
                <Typography variant="h5" className={classes.headerText} gutterBottom>
                  View reported issues
                </Typography>
                <ShareItemsComponent displayReports={true} />
              </>
            ) : null}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        {NAVIGATION_TABS.map((v) => (
          <Tooltip title={v.subtitle} key={v.id}>
            <Tab
              label={
                <span className={classes.textIconContainer}>
                  {v.icon} {v.displayName}
                </span>
              }
            />
          </Tooltip>
        ))}
      </Tabs>
      {displaySelection(value)}
    </Box>
  );
};

EventDetailsDrawerComponent.defaultProps = {
  eventID: '',
  volunteeringActivities: [],
  userDetail: {},
  handleRSVP: () => {},
  isChecked: false,
  disabled: true,
  selectedEvent: {},
};

EventDetailsDrawerComponent.propTypes = {
  eventID: PropTypes.string,
  volunteeringActivities: PropTypes.array,
  userDetail: PropTypes.object,
  handleRSVP: PropTypes.func,
  isChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  selectedEvent: PropTypes.object,
};

export default EventDetailsDrawerComponent;
