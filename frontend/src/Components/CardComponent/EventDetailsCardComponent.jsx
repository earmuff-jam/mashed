import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  Tooltip,
  Badge,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import Title from '../DialogComponent/Title';
import Drawer from '../DrawerListComponent/Drawer';
import { isEditingAllowed } from '../Event/constants';
import ViewSharableGroups from './ViewSharableGroups';
import AddItemDetail from '../ItemDetail/AddItemDetail';
import LoadingSkeleton from '../../util/LoadingSkeleton';
import ViewItemDetail from '../ItemDetail/ViewItemDetail';
import { homeActions } from '../../Containers/Home/homeSlice';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { eventActions } from '../../Containers/Event/eventSlice';
import EditCommunityEvent from '../CommunityEventComponent/EditCommunityEvent';
import ReportCommunityEvent from '../CommunityEventComponent/ReportCommunityEvent';
import EventCardTitleWithAvatarComponent from './EventCardTitleWithAvatarComponent';
import { LowPriorityRounded, BugReportRounded, EditRounded, DoneRounded, PlaceRounded } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  columnVariant: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(0),
    },
  },
  centerAlign: {
    wordWrap: true,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  chip: {
    fontSize: '0.725rem',
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[100],
  },
  emptyGap: {
    flexGrow: 1,
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
  primaryColor: {
    color: theme.palette.primary.main,
  },
  colorVariant: {
    color: theme.palette.grey[400],
  },
  text: {
    color: theme.palette.primary.main,
    fontSize: '0.725rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Roboto',
  },
}));

const EventDetailsCardComponent = ({
  disabled,
  userDetail,
  handleUserDetail,
  userDetailError,
  eventID,
  isLoading,
  isDeactivated,
  setIsDeactivated,
  selectedEvent,
  reports,
  onLeave,
  onJoin,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editingAllowed = isEditingAllowed(disabled, userDetail);

  const [display, setDisplay] = useState(0);
  // editing general fields for select event
  const [editMode, setEditMode] = useState(false);
  const [displayCollaboratorList, setDisplayCollaboratorList] = useState(false);

  const remainingSpots = selectedEvent?.max_attendees - selectedEvent?.sharable_groups?.length || 0;

  const handleReportEvent = () => setDisplay('Report');
  const toggleCollaboratorList = () => setDisplayCollaboratorList(!displayCollaboratorList);

  const toggleEditMode = () => {
    if (editMode) {
      const editingTitleLength = userDetail.title.length || 0;
      const editingAllocatedMembersCount = userDetail.totalAllocatedMembers.length || 0;
      if (
        editingTitleLength <= 0 ||
        editingTitleLength >= 100 ||
        isNaN(userDetail.totalAllocatedMembers) ||
        (isNaN(editingAllocatedMembersCount) && Number(editingAllocatedMembersCount) > 0) ||
        Object.values(userDetailError).filter(Boolean).length > 0
      ) {
        enqueueSnackbar('Unable to update event.', {
          variant: 'error',
        });
        return;
      }
      // userID is retrieved from local storage
      const userID = localStorage.getItem('userID');
      // flushGeneralEventDetails updates only selected event reducer
      // homeActions.updateEvent will update the db, this gives us ability to view
      // data as a two way binding mechanism.
      dispatch(
        eventActions.flushGeneralEventDetails({
          id: userDetail.id,
          title: userDetail.title,
          deactivated: isDeactivated,
          comments: userDetail.comments,
          max_attendees: Number(userDetail.totalAllocatedMembers),
          updated_by: userID,
        })
      );
      dispatch(
        homeActions.updateEvent({
          ...userDetail,
          id: userDetail.id,
          title: userDetail.title,
          deactivated: isDeactivated,
          comments: userDetail.comments,
          max_attendees: Number(userDetail.totalAllocatedMembers),
          updated_by: userID,
        })
      );
      enqueueSnackbar('Sucessfully updated event', {
        variant: 'success',
      });
    }
    setEditMode(!editMode);
  };

  const handleViewItems = () => {
    setDisplay('View');
    dispatch(eventActions.getItemList({ eventID }));
  };

  const handleAddItem = () => {
    setDisplay('Add');
    dispatch(eventActions.getStorageLocations(eventID));
  };

  const toggleDrawer = (event) => {
    setDisplay(event);
    // only fetch api data first time load
    if (event) {
      dispatch(eventActions.getItemList({ eventID }));
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Box className={classNames(classes.rowContainer, classes.columnVariant)}>
          <EventCardTitleWithAvatarComponent userDetail={userDetail} isLoading={isLoading} editMode={editMode} />
          <Box className={classes.emptyGap}></Box>
          <Box>
            {!isLoading ? (
              <Box>
                {userDetail?.isCreator && editMode ? (
                  <Button variant="text" className={classes.primaryColor} onClick={toggleCollaboratorList}>
                    Edit Collaborators
                  </Button>
                ) : null}
                <Button
                  data-tour="3"
                  variant="text"
                  className={classes.primaryColor}
                  disabled={userDetail?.isCreator}
                  onClick={userDetail?.userIsMember ? onLeave : onJoin}
                >
                  {userDetail?.userIsMember ? 'Leave Event' : 'Join Event'}
                </Button>
                <Tooltip title="Report issue or problem within this event. Also displays the number of reports made against this event. Report can be of various reasons however if emergency please stop and dial 911.">
                  <IconButton
                    disabled={disabled}
                    onClick={handleReportEvent}
                    data-tour="4"
                    size="large">
                    <Badge badgeContent={reports?.length || 0} color="error" overlap="rectangular">
                      <BugReportRounded />
                    </Badge>
                  </IconButton>
                </Tooltip>
                {userDetail?.userIsMember && (
                  <Tooltip title={!editMode ? 'Edit event' : 'Save changes'}>
                    <IconButton onClick={toggleEditMode} size="large">
                      {!editMode ? <EditRounded /> : <DoneRounded color="primary" />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ) : (
              <LoadingSkeleton width={`calc(10% - 1rem)`} height={'2rem'} />
            )}
          </Box>
        </Box>
        <Box className={classNames((classes.rowContainer, classes.chipContainer))} data-tour="6">
          {userDetail?.requiredSkills.length > 0 &&
            userDetail?.requiredSkills[0] !== '' &&
            userDetail?.requiredSkills.map((v, index) => (
              <Chip key={index} size="small" icon={<LowPriorityRounded />} label={v} className={classes.chip} />
            ))}
        </Box>
        <CardActions data-tour="7">
          <ButtonComponent
            disabled={!userDetail?.userIsMember}
            onClick={handleAddItem}
            buttonStyles={classes.text}
            text={'Add Items'}
            buttonVariant={'text'}
          />
          <ButtonComponent
            onClick={handleViewItems}
            buttonStyles={classes.text}
            text={'View Items'}
            buttonVariant={'text'}
          />
        </CardActions>
        <Box className={classes.centerAlign} data-tour="8">
          <PlaceRounded className={classes.colorVariant} />
          <span>{remainingSpots} spots left</span>
        </Box>
        {editMode && (
          <EditCommunityEvent
            userDetail={userDetail}
            handleUserDetail={handleUserDetail}
            isDeactivated={isDeactivated}
            setIsDeactivated={setIsDeactivated}
          />
        )}
        {displayCollaboratorList && (
          <Dialog open width={'md'} fullWidth={true}>
            <Title onClose={() => setDisplayCollaboratorList(false)}>Edit Admin</Title>
            <ViewSharableGroups selectedEvent={selectedEvent} setDisplayCollaboratorList={setDisplayCollaboratorList} />
          </Dialog>
        )}
      </CardContent>
      <Drawer open={display === 'View'} toggleDrawer={toggleDrawer}>
        <ViewItemDetail disabled={editingAllowed} />
      </Drawer>
      {display === 'Add' && (
        <Dialog open width={'md'} fullWidth={true}>
          <Title onClose={() => setDisplay(0)}>Add New Item</Title>
          <AddItemDetail eventID={eventID} setDisplayMode={setDisplay} />
        </Dialog>
      )}
      {display === 'Report' && (
        <Dialog open width={'md'} fullWidth={true}>
          <Title onClose={() => setDisplay(0)}>Report Unusual Activity</Title>
          <ReportCommunityEvent events={[selectedEvent]} setDisplayMode={setDisplay} />
        </Dialog>
      )}
    </Card>
  );
};

EventDetailsCardComponent.defaultProps = {
  disabled: false,
  userDetail: {},
  handleUserDetail: () => {},
  userDetailError: {},
  eventID: '',
  isLoading: false,
  isDeactivated: false,
  setIsDeactivated: () => {},
  selectedEvent: {},
  reports: [],
  onLeave: () => {},
  onJoin: () => {},
};

EventDetailsCardComponent.propTypes = {
  disabled: PropTypes.bool,
  userDetail: PropTypes.object,
  handleUserDetail: PropTypes.func,
  userDetailError: PropTypes.object,
  eventID: PropTypes.string,
  isLoading: PropTypes.bool,
  isDeactivated: PropTypes.bool,
  setIsDeactivated: PropTypes.func,
  selectedEvent: PropTypes.object,
  reports: PropTypes.array,
  onLeave: PropTypes.func,
  onJoin: PropTypes.func,
};

export default EventDetailsCardComponent;
