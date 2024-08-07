import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Typography, TextField, IconButton } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { DoneRounded } from '@mui/icons-material';

import EmptyComponent from '../../util/EmptyComponent';
import Autocomplete from '@mui/material/Autocomplete';
import { eventActions } from '../../Containers/Event/eventSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  text: {
    fontSize: '0.725rem',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  subtext: {
    fontSize: '0.725rem',
    fontFamily: 'Roboto',
  },
  aside: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const ImpactTracking = ({ eventID, userID, requiredSkills, isChecked, disabled }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [activities, setActivities] = useState([]);
  const [volunteerHours, setVolunteerHours] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  const isErrorVolunteerHours = volunteerHours.length && (volunteerHours < 0 || isNaN(volunteerHours));

  const resetForm = () => {
    setVolunteerHours('');
    setSelectedActivity('');
  };

  const handleSubmit = () => {
    const requiredFields = [selectedActivity, volunteerHours];
    const isRequiredFieldsEmpty = requiredFields?.some((v) => v.length === 0);

    if (isRequiredFieldsEmpty || isErrorVolunteerHours) {
      enqueueSnackbar('Unable to update fields.', {
        variant: 'error',
      });
      return;
    }

    const submittedData = {
      volunteer_hours: Math.ceil(volunteerHours).toString(),
      volunteeringActivity: selectedActivity,
      skill_name: selectedActivity,
      eventID: eventID,
      userID: userID,
    };
    dispatch(eventActions.addVolunteeringHours(submittedData));
    enqueueSnackbar('Successfully added volunteering hours.', {
      variant: 'success',
    });
    resetForm();
  };

  useEffect(() => {
    if (Array.isArray(requiredSkills) && requiredSkills.length >= 0) {
      setActivities(requiredSkills);
    }
  }, [requiredSkills]);

  if (!isChecked) {
    return (
      <>
        <EmptyComponent subtitle="Rsvp to log volunteering hours." />
      </>
    );
  }

  return (
    <Box className={classes.root}>
      <Typography className={classes.text} gutterBottom>
        Log volunteer hours and track activities
      </Typography>
      <div className={classes.aside}>
        <Autocomplete
          id="volunteering-activities-selector"
          options={activities}
          value={selectedActivity || ''}
          disabled={disabled}
          onChange={(_, value) => setSelectedActivity(value)}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Volunteering on" variant="outlined" />}
        />
        <TextField
          id="volunteerHours"
          disabled={disabled}
          variant="standard"
          fullWidth
          label="Volunteer hours"
          value={volunteerHours}
          onChange={(e) => setVolunteerHours(e.target.value)}
          error={isErrorVolunteerHours.length ?? false}
          helperText={isErrorVolunteerHours ? 'must be +ve in nature ' : null}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              handleSubmit();
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSubmit} disabled={disabled} size="large">
                <DoneRounded />
              </IconButton>
            ),
          }}
        />
        <Typography className={classes.subtext} gutterBottom>
          Volunteering hours are rounded to the nearest hour
        </Typography>
      </div>
    </Box>
  );
};

ImpactTracking.defaultProps = {
  eventID: '',
  userID: '',
  requiredSkills: [],
  isChecked: false,
  disabled: false,
};

ImpactTracking.propTypes = {
  eventID: PropTypes.string,
  userID: PropTypes.string,
  requiredSkills: PropTypes.array,
  isChecked: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ImpactTracking;
