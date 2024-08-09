import { useEffect, useState } from 'react';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { BLANK_PROFILE_DETAILS } from './constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { useDispatch, useSelector } from 'react-redux';
import { profileActions } from './profileSlice';

dayjs.extend(relativeTime);

const ProfileContent = () => {
  const dispatch = useDispatch();
  const { loading, profileDetails: data = {} } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState(BLANK_PROFILE_DETAILS);

  const submit = (ev) => {
    ev.preventDefault();
    const draftData = Object.entries(formData).reduce((acc, [key, valueObj]) => {
      if (['created_on', 'updated_on'].includes(key)) {
        acc[key] = valueObj;
      } else {
        acc[key] = valueObj.value;
      }
      return acc;
    }, {});
    draftData['updated_on'] = dayjs();
    dispatch(profileActions.updateProfileDetails({ draftData }));
  };

  const handleChange = (ev) => {
    const { id, value } = ev.target;
    const updatedFormData = { ...formData };
    let errorMsg = '';
    for (const validator of updatedFormData[id].validators) {
      if (validator.validate(value)) {
        errorMsg = validator.message;
        break;
      }
    }
    updatedFormData[id] = {
      ...updatedFormData[id],
      value,
      errorMsg,
    };
    setFormData(updatedFormData);
  };

  useEffect(() => {
    if (!loading) {
      const draftProfileDetails = { ...BLANK_PROFILE_DETAILS };
      draftProfileDetails.username.value = data.username;
      draftProfileDetails.full_name.value = data.full_name;
      draftProfileDetails.email_address.value = data.email_address;
      draftProfileDetails.phone_number.value = data.phone_number;
      draftProfileDetails.about_me.value = data.about_me;
      draftProfileDetails.created_on = data.created_on;
      draftProfileDetails.updated_on = data.updated_at;
      setFormData(draftProfileDetails);
    }
  }, [loading]);

  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profile details
        </Typography>
        <Typography variant="caption" gutterBottom>
          Brief details about yourself to help others notice you.
        </Typography>
        <Divider />
      </Box>
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight="bold">
          User name
        </Typography>
        <TextField
          fullWidth
          id="username"
          name="username"
          placeholder="User Name"
          value={formData?.username.value || ''}
          onChange={handleChange}
          variant="outlined"
          size="small"
          error={Boolean(formData.username['errorMsg'].length)}
          helperText={formData.username['errorMsg']}
        />
        <Typography variant="caption">Your display name throughout the application.</Typography>
        <Typography variant="body1" fontWeight="bold">
          First name
        </Typography>
        <TextField
          fullWidth
          id="full_name"
          name="full_name"
          placeholder="Full name"
          value={formData?.full_name.value || ''}
          onChange={handleChange}
          variant="outlined"
          size="small"
          error={Boolean(formData.full_name['errorMsg'].length)}
          helperText={formData.full_name['errorMsg']}
        />
        <Typography variant="body1" fontWeight="bold">
          Email address
        </Typography>
        <TextField
          fullWidth
          id="email_address"
          name="email_address"
          placeholder="Email Address"
          value={formData?.email_address.value || ''}
          onChange={handleChange}
          variant="outlined"
          size="small"
          error={Boolean(formData.email_address['errorMsg'].length)}
          helperText={formData.email_address['errorMsg']}
        />

        <Typography variant="body1" fontWeight="bold">
          Phone Number
        </Typography>
        <TextField
          fullWidth
          id="phone_number"
          name="phone_number"
          placeholder="Phone Number"
          value={formData?.phone_number.value || ''}
          onChange={handleChange}
          variant="outlined"
          size="small"
          error={Boolean(formData.phone_number['errorMsg'].length)}
          helperText={formData.phone_number['errorMsg']}
        />

        <Typography variant="body1" fontWeight="bold">
          About me
        </Typography>
        <TextField
          fullWidth
          id="about_me"
          name="about_me"
          placeholder="Couple of words to describe yourself."
          value={formData?.about_me?.value || ''}
          onChange={handleChange}
          variant="outlined"
          multiline={true}
          rows={4}
          size="small"
          error={Boolean(formData.about_me['errorMsg'].length)}
          helperText={formData.about_me['errorMsg']}
        />

        <Typography variant="body1">
          {formData?.updated_on === null
            ? `Created ${dayjs(formData?.created_on).fromNow()}`
            : `Last updated ${dayjs(formData?.updated_on).fromNow()}`}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={submit}
            disabled={Object.values(formData).some((v) => v?.errorMsg?.length > 0)}
          >
            Update profile
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default ProfileContent;
