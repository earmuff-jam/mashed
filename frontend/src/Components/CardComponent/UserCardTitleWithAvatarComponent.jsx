import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Avatar, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CardTitleComponent from './CardTitleComponent';
import EditImageComponent from '../Event/EditImageComponent';
import { profileActions } from '../../features/Profile/profileSlice';
import { enqueueSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1.2rem',
    textOverflow: 'ellipsis',
    textWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      width: `26rem`,
    },
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const UserCardTitleWithAvatarComponent = ({
  formFields,
  avatarUrl,
  profileID,
  editMode,
  allowEditProfileImg,
  isLoading,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [editImage, setEditImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const toggleEditImage = () => {
    setEditImage(!editImage);
    const input = document.querySelector('input[type="file"]');
    if (input) {
      input.value = ''; // Reset the value of the input to clear the selected file (if possible)
    }
  };

  const handleSubmitImage = async (userID) => {
    if (!allowEditProfileImg) {
      enqueueSnackbar('Unable to edit. Missing profile details.', {
        variant: 'error',
      });
      return;
    }
    if (uploadedImage === null) {
      enqueueSnackbar('Unable to edit. Missing avatar.', {
        variant: 'error',
      });
      return;
    }
    dispatch(profileActions.updateProfileImage({ selectedImage: uploadedImage, userID: userID }));
    toggleEditImage();
    setEditImage(!editImage);
  };

  useEffect(() => {
    if (avatarUrl) {
      setSelectedImage(avatarUrl);
    }
  }, [avatarUrl]);

  return (
    <Box className={classes.root}>
      <Box className={classNames(classes.rowContainer, classes.gutterBottom)}>
        {editImage ? (
          <EditImageComponent
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            toggleEditImage={toggleEditImage}
            submit={handleSubmitImage}
            id={profileID}
          />
        ) : (
          <Avatar
            alt="your avatar"
            src={selectedImage && `data:image/png;base64,${selectedImage}`}
            className={classes.avatar}
            onClick={toggleEditImage}
          />
        )}
      </Box>
      <CardTitleComponent
        firstIcon={formFields.username.icon}
        firstLabel={formFields.username.value}
        firstToolTipLabel={'Your username'}
        secondIcon={formFields.phone.icon}
        secondLabel={formFields.phone.value}
        secondTooltipLabel={'your phone number'}
        titleText={formFields.name.value || 'Anonymous'}
        extraSubtitle={formFields.aboutMe.value || 'Edit profile details to add description'}
        editMode={editMode}
        isLoading={isLoading}
      />
    </Box>
  );
};

UserCardTitleWithAvatarComponent.defaultProps = {
  formFields: {},
  avatarUrl: '',
  profileID: '',
  isLoading: false,
  editMode: false,
  allowEditProfileImg: false,
};

UserCardTitleWithAvatarComponent.propTypes = {
  formFields: PropTypes.object,
  avatarUrl: PropTypes.string,
  profileID: PropTypes.string,
  isLoading: PropTypes.bool,
  editMode: PropTypes.bool,
  allowEditProfileImg: PropTypes.bool,
};
export default UserCardTitleWithAvatarComponent;
