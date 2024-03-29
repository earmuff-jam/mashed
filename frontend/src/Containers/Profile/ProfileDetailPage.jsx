import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { profileActions } from './profileSlice';
import { homeActions } from '../Home/homeSlice';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { USER_PROFILE_FORM_FIELDS } from './constants';
import { Container, Grid, Popover } from '@material-ui/core';
import Notification from '../../Components/Profile/Notification';
import ProfileDetailsCard from '../../Components/Profile/ProfileDetailsCard';
import ProfileNavigationMenu from '../../Components/ProfileNavigationMenu/ProfileNavigationMenu';

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem auto',
    minHeight: '100%',
    backgroundColor: theme.palette.secondary.main,
  },
}));

const ProfileDetailPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading: eventsLoading } = useSelector((state) => state.home);
  const { loading: profilePageLoading, profileDetails, notifications } = useSelector((state) => state.profile);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formFields, setFormFields] = useState(USER_PROFILE_FORM_FIELDS);

  const handleToggle = () => setEditMode(!editMode);
  const handleCloseNotificationBar = () => setAnchorEl(null);
  const handleClickNotificationBar = (event) => setAnchorEl(event.currentTarget);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleNotificationMenuSelect = (id) => {
    const selectedNotification = notifications.filter((v) => v.id === id).find(() => true);
    const draftNotification = produce(selectedNotification, (draft) => {
      draft.is_viewed = true;
    });
    dispatch(profileActions.updateProfileNotification({ data: draftNotification }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormFields((prevFormFields) => {
      const updatedFormFields = { ...prevFormFields };
      updatedFormFields[name].value = value;
      updatedFormFields[name].errorMsg = '';

      for (const validator of updatedFormFields[name].validators) {
        if (validator.validate(value)) {
          updatedFormFields[name].errorMsg = validator.message;
          break;
        }
      }
      return updatedFormFields;
    });
  };

  const handleSubmit = () => {
    const containsErr = Object.values(formFields).reduce((acc, el) => {
      if (el.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formFields).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => el.value.trim() === '');

    if (containsErr || isRequiredFieldsEmpty) {
      enqueueSnackbar('Cannot update user profile details.', {
        variant: 'error',
      });
      return;
    } else {
      const formattedData = Object.values(formFields).reduce((acc, el) => {
        if (el.value) {
          acc[el.name] = el.value;
        }
        return acc;
      }, {});
      dispatch(profileActions.updateProfileDetails({ formattedData }));
      handleToggle();
      enqueueSnackbar('Successfully updated user profile details.', {
        variant: 'success',
      });
    }
  };

  useEffect(() => {
    dispatch(homeActions.getEvents());
    dispatch(profileActions.getProfileDetails());
    dispatch(profileActions.getProfileNotifications());
    dispatch(profileActions.getRecentActivitiesList());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profileDetails.id) {
      dispatch(profileActions.getVolunteeringDetails({ userID: profileDetails.id }));
      dispatch(profileActions.getRecentActivitiesTrophyList({ userID: profileDetails.id }));
    }
    const updatedFormFields = { ...formFields };
    updatedFormFields.name.value = profileDetails?.full_name || '';
    updatedFormFields.phone.value = profileDetails?.phone_number || '';
    updatedFormFields.username.value = profileDetails?.username || '';
    updatedFormFields.objective.value = profileDetails?.goal || '';
    updatedFormFields.aboutMe.value = profileDetails?.about_me || '';
    setFormFields(updatedFormFields);
    // eslint-disable-next-line
  }, [profileDetails]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <ProfileDetailsCard
            editMode={editMode}
            formFields={formFields}
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            handleToggle={handleToggle}
            notifications={notifications}
            profileDetails={profileDetails}
            isLoading={profilePageLoading || eventsLoading}
            handleClickNotificationBar={handleClickNotificationBar}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseNotificationBar}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Notification notifications={notifications} handleNotificationMenuSelect={handleNotificationMenuSelect} />
          </Popover>
        </Grid>
        <Grid item xs={12} data-tour="1">
          <ProfileNavigationMenu />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileDetailPage;
