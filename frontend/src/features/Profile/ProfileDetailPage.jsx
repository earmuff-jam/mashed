import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { profileActions } from './profileSlice';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Popover } from '@mui/material';
import Notification from '../../Components/Profile/Notification';
import ProfileNavigationMenu from '../../Components/ProfileNavigationMenu/ProfileNavigationMenu';
import ProfileDetailsCardComponent from '../../Components/CardComponent/ProfileDetailsCardComponent';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: `calc(100% - 2rem)`,
    minHeight: '100vh',
    margin: '0 auto',
  },
}));

const ProfileDetailPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading: profilePageLoading, profileDetails, notifications } = useSelector((state) => state.profile);

  const [formFields, setFormFields] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);

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
    dispatch(profileActions.getProfileDetails());
    dispatch(profileActions.getProfileNotifications());
  }, []);

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <ProfileDetailsCardComponent
            editMode={editMode}
            formFields={[]}
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            handleToggle={handleToggle}
            notifications={notifications}
            profileDetails={profileDetails}
            isLoading={profilePageLoading}
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
        <Grid item xs={12} data-tour="2">
          <ProfileNavigationMenu />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileDetailPage;
