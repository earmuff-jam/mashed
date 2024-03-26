import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { eventActions } from '../../Containers/Event/eventSlice';
import ButtonComponent from '../../stories/Button/ButtonComponent';
import TextComponent from '../../stories/TextComponent/TextComponent';
import { BLANK_REPORT_FORM, BLANK_REPORT_FORM_ERROR, BLANK_REPORT_FORM_TOUCHED } from './constants';
import { TextField, FormControl, FormControlLabel, FormHelperText, Box, Checkbox } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  caption: {
    fontSize: '0.985rem',
  },
}));

const ReportCommunityEvent = ({ events, setDisplayMode }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { profileDetails } = useSelector((state) => state.profile);

  const [report, setReport] = useState(BLANK_REPORT_FORM);
  const [errors, setErrors] = useState(BLANK_REPORT_FORM_ERROR);
  const [touched, setTouched] = useState(BLANK_REPORT_FORM_TOUCHED);

  // we don't allow prefil if reporting an event from the main page.
  // to protect user privacy, we don't display the creator name as well.
  // if reporting from within the event, prefilling should display necessary items.
  const prefil = (field, value) => {
    if (field === 'id') {
      const filteredEvents = events.filter((v) => v.id === value).find((v) => true);
      setReport((prev) =>
        produce(prev, (draft) => {
          draft.event_location = filteredEvents?.display_name || '';
          draft.organizer_name = filteredEvents?.creator_name || '';
        })
      );

      setTouched((prev) => ({
        ...prev,
        id: true,
        event_location: true,
        organizer_name: true,
      }));

      // if location is empty during prefil, require the user to upload it
      setErrors((prev) => ({
        ...prev,
        id: false,
        event_location: filteredEvents?.display_name?.length <= 0 ? 'Event location is required' : false,
        organizer_name: filteredEvents?.creator_name?.length <= 0 ? 'Organizer Name is required' : false,
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setReport((prev) =>
      produce(prev, (draft) => {
        draft[field] = value;
      })
    );
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));

    // Validate the field
    prefil(field, value);
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'subject':
        if (!value) {
          error = 'Subject is required';
        }
        break;
      case 'description':
        if (!value) {
          error = 'Description is required';
        }
        break;
      case 'event_location':
        if (value.length <= 0 || !value) {
          error = 'Event Location is required';
        }
        break;
      case 'id':
        if (!value) {
          error = 'Event is required';
        }
        break;
      case 'organizer_name':
        if (!value) {
          error = 'Organizer Name is required';
        }
        break;
      case 'is_checked':
        if (!value) {
          // this error does not display
          error = 'Agreement to the appropriate policies are required';
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const isFormValid = () => {
    return Object.values(errors).every((error) => !error) && Object.values(touched).every((touch) => touch);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = dayjs();
    const formattedReport = {
      ...report,
      event_id: report.id,
      created_at: formattedDate,
      updated_at: formattedDate,
      created_by: profileDetails.id,
      updated_by: profileDetails.id,
      sharable_groups: [profileDetails.id],
    };
    dispatch(eventActions.createNewReportAgainstEvent(formattedReport));
    setReport(BLANK_REPORT_FORM);
    enqueueSnackbar('Successfully submitted report.', {
      variant: 'warning',
    });
    setDisplayMode(0);
  };

  return (
    <Box className={classes.container}>
      <TextComponent
        value={`
      We take unusual activity seriously. Your report will be reviewed and appropriate action will be taken. Filing a false report can have serious consequences, including legal liability for any damages incurred.`}
        loading={false}
        gutterBottom={true}
        color={'textSecondary'}
        variant="caption"
      />
      <TextComponent
        value={`Please provide details about the suspicious activity below.`}
        loading={false}
        gutterBottom={true}
        color={'textSecondary'}
        variant="caption"
      />
      <form>
        <TextField
          fullWidth
          className={classes.textField}
          label="Subject"
          variant="outlined"
          value={report.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          required
          error={touched.subject && !!errors.subject}
          helperText={touched.subject && errors.subject}
        />
        <TextField
          fullWidth
          className={classes.textField}
          label="Description"
          variant="outlined"
          multiline
          minRows={5}
          value={report.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          error={touched.description && !!errors.description}
          helperText={touched.description && errors.description}
        />
        <div className={classes.textField}>
          <Autocomplete
            id="selected-projects"
            options={events}
            onChange={(_, value) => handleInputChange('id', value ? value.id : '')}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Event" variant="standard" />}
          />
        </div>
        <TextField
          fullWidth
          className={classes.textField}
          label="Event Location"
          variant="outlined"
          value={report.event_location}
          onChange={(e) => handleInputChange('event_location', e.target.value)}
          required
          error={touched.event_location && !!errors.event_location}
          helperText={touched.event_location && errors.event_location}
        />
        <TextField
          fullWidth
          className={classes.textField}
          label="Organizer Name"
          variant="outlined"
          value={report.organizer_name}
          onChange={(e) => handleInputChange('organizer_name', e.target.value)}
          required
          error={touched.organizer_name && !!errors.organizer_name}
          helperText={touched.organizer_name && errors.organizer_name}
        />
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                checked={report.is_checked}
                onChange={(e) => handleInputChange('is_checked', e.target.checked)}
                color="primary"
              />
            }
            label="Submit for review."
            classes={{ label: classes.caption }}
          />
          {errors.reason && <FormHelperText>Checkbox must be selected</FormHelperText>}
        </FormControl>
        <Box>
          <ButtonComponent
            text={'Submit Report'}
            onClick={handleSubmit}
            buttonVariant={'text'}
            disabled={!isFormValid()}
            buttonStyles={classes.submitButton}
          />
        </Box>
      </form>
    </Box>
  );
};

export default ReportCommunityEvent;
