import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, Box, Button, Card, CardContent, IconButton } from '@material-ui/core';
import { EditRounded, CancelRounded, NotificationImportantRounded } from '@material-ui/icons';

import classNames from 'classnames';
import UserProfile from '../ViewProfileDetails/UserProfile';
import EditingUserProfile from '../ViewProfileDetails/EditingUserProfile';
import LoadingSkeleton from '../../util/LoadingSkeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
  },
  columnVariant: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      gap: theme.spacing(0),
    },
  },
  buttonColor: {
    color: theme.palette.primary.main,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  iconButton: {
    padding: theme.spacing(0.6),
  },
  colorVariant: {
    color: theme.palette.primary.main,
  },
  emptyGap: {
    flexGrow: 1,
  },
  iconTilt: {
    // runs tilt-shaking fn for 5seconds at 0.5 rate of speed
    animation: '$tilt-shaking 0.5s 5',
  },
  '@keyframes tilt-shaking': {
    '0%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(5deg)' },
    '50%': { transform: 'rotate(0deg)' },
    '75%': { transform: 'rotate(-5deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
}));

const ProfileDetailsCard = ({
  editMode,
  isLoading,
  formFields,
  handleInput,
  handleSubmit,
  handleToggle,
  profileDetails,
  notifications,
  handleClickNotificationBar,
}) => {
  const classes = useStyles();

  const containsUnreadNotifications = notifications.map((v) => !v.is_viewed).filter(Boolean).length;
  return (
    <Card className={classes.root}>
      <CardContent>
        <Box className={classNames(classes.rowContainer, classes.columnVariant)} data-tour="0">
          <UserProfile formFields={formFields} avatarUrl={profileDetails?.avatar_url} profileID={profileDetails.id} />
          <Box className={classes.emptyGap}></Box>
          {!isLoading ? (
            <Box data-tour="1">
              <Button disabled={!editMode} variant={'text'} onClick={handleSubmit} className={classes.buttonColor}>
                Submit
              </Button>
              <IconButton onClick={handleToggle}>{!editMode ? <EditRounded /> : <CancelRounded />}</IconButton>
              <IconButton
                onClick={handleClickNotificationBar}
                disabled={isLoading || notifications.length <= 0}
                className={classes.iconTilt}
              >
                <Badge badgeContent={containsUnreadNotifications} variant="dot" color="error" overlap="rectangular">
                  <NotificationImportantRounded color={containsUnreadNotifications ? 'primary' : 'secondary'} />
                </Badge>
              </IconButton>
            </Box>
          ) : (
            <LoadingSkeleton width={`calc(10% - 1rem)`} height={'2rem'} />
          )}
        </Box>
        {editMode && <EditingUserProfile formFields={formFields} handleInput={handleInput} />}
      </CardContent>
    </Card>
  );
};

ProfileDetailsCard.defaultProps = {
  editMode: false,
  isLoading: false,
  formFields: {},
  handleInput: () => {},
  handleSubmit: () => {},
  handleToggle: () => {},
  profileDetails: {},
  notifications: [],
  handleClickNotificationBar: () => {},
};

ProfileDetailsCard.propTypes = {
  editMode: PropTypes.bool,
  isLoading: PropTypes.bool,
  formFields: PropTypes.object,
  handleInput: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleToggle: PropTypes.func,
  profileDetails: PropTypes.object,
  notifications: PropTypes.array,
  handleClickNotificationBar: PropTypes.func,
};

export default ProfileDetailsCard;
