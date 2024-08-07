import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorOutlineRounded } from '@mui/icons-material';
import { homeActions } from '../../features/Home/homeSlice';
import { TextField, Button, Box, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { BLANK_NEW_EVENT, BLANK_NEW_EVENT_ERROR, BLANK_NEW_EVENT_TOUCHED, SKILLS_REQUIRED_OPTIONS } from './constants';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
    padding: theme.spacing(4),
  },
  textField: {
    fontFamily: 'Roboto',
    marginBottom: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const AddCommunityEvent = ({ setEditMode }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userID = localStorage.getItem('userID');
  const { loading, causeList, projectTypes, allStatesUS } = useSelector((state) => state.home);

  const [project, setProject] = useState(BLANK_NEW_EVENT);
  const [errors, setErrors] = useState(BLANK_NEW_EVENT_ERROR);
  const [touched, setTouched] = useState(BLANK_NEW_EVENT_TOUCHED);

  const [causeOptions, setCauseOptions] = useState([]);
  const [allStatesList, setAllStatesList] = useState([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState([]);

  const handleInputChange = (field, value) => {
    setProject((prevProject) => ({
      ...prevProject,
      [field]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'title':
        if (!value) {
          error = 'Title is required.';
        }
        break;
      case 'cause':
        if (!value) {
          error = 'Cause is required.';
        }
        break;
      case 'max_attendees':
        if (isNaN(value) || parseInt(value) <= 0) {
          error = 'Max Attendees must be a positive number.';
        }
        break;

      case 'street':
        if (!value) {
          error = 'Street Address is required.';
        }
        break;

      case 'city':
        if (!value) {
          error = 'City is required.';
        }
        break;

      case 'state':
        if (!value || value.length !== 2) {
          error = 'State is required in the form of XX';
        }
        break;

      case 'zip':
        // You can add more specific validation for zip code here
        if (isNaN(value) || parseInt(value) <= 0) {
          error = 'Zip code is required and must be +ve in nature';
        }
        break;

      case 'project_type':
        if (!value) {
          error = 'Type of project is required.';
        }
        break;

      case 'comments':
        break;

      case 'required_total_man_hours':
        if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Hours of Effort must be a positive number.';
        }
        if (!value) {
          error = 'Hours of Effort is required';
        }
        break;

      case 'skills_required':
        if (!Array.isArray(value) || value.length <= 0) {
          error = 'Skills are required';
        }
        break;

      case 'start_date':
        if (!value) {
          error = 'Start date is required.';
        }
        break;

      case 'price':
        if (isNaN(value) || parseFloat(value) < 0) {
          error = 'Unit price must be a positive number.';
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

  const handleNavigation = (path) => navigate(path);

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = dayjs().toISOString();
    const draftEvent = {
      ...project,
      price: parseFloat(project.price),
      max_attendees: parseInt(project.max_attendees),
      required_total_man_hours: parseInt(project.required_total_man_hours),
      start_date: dayjs(project.start_date, 'YYYY-MM-DDTHH:mm').format(),
      created_at: currentDate,
      updated_at: currentDate,
      created_by: userID,
      updated_by: userID,
      attendees: [userID],
      sharable_groups: [userID],
      admins: [userID],
    };

    dispatch(homeActions.createEvent({ draftEvent }));
    setEditMode(false);
    setProject(BLANK_NEW_EVENT);
    enqueueSnackbar('Successfully added new community event.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (!loading && causeList) {
      setCauseOptions(causeList);
    }
    if (!loading && projectTypes) {
      setProjectTypeOptions(projectTypes);
    }
    if (!loading && allStatesUS) {
      setAllStatesList(allStatesUS);
    }
  }, [causeList, loading, projectTypes, allStatesUS]);

  return (
    <div className={classes.container}>
      <Typography variant="caption" color="textSecondary">
        To ensure accurate and comprehensive event listings, please fill in all the required fields below. Your
        cooperation helps us maintain a high-quality database and ensures that users can easily discover and engage with
        your event.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          className={classes.textField}
          label="Title"
          variant="standard"
          value={project.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          error={touched.title && !!errors.title}
          helperText={touched.title && errors.title}
        />
        <Box className={classnames(classes.rowContainer, classes.gutterBottom)}>
          <Autocomplete
            id="cause-autocomplete"
            fullWidth
            options={causeOptions}
            onChange={(e, value) => {
              const projectCause = value?.cause || '';
              return handleInputChange('cause', projectCause);
            }}
            getOptionLabel={(option) => option.cause}
            renderInput={(params) => <TextField {...params} label="Cause" variant="standard" />}
          />
          <Autocomplete
            id="project-type-autocomplete"
            fullWidth
            options={projectTypeOptions}
            onChange={(e, value) => {
              const typeOfProject = value?.type || '';
              return handleInputChange('project_type', typeOfProject);
            }}
            getOptionLabel={(option) => option.type}
            renderInput={(params) => <TextField {...params} label="Project Type" variant="standard" />}
          />
        </Box>
        <TextField
          fullWidth
          className={classes.textField}
          label="Street Address"
          variant="outlined"
          value={project.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          required
          error={touched.street && !!errors.street}
          helperText={touched.street && errors.street}
        />
        <Box className={classnames(classes.rowContainer, classes.gutterBottom)}>
          <TextField
            className={classes.textField}
            label="City"
            fullWidth
            variant="standard"
            value={project.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            required
            error={touched.city && !!errors.city}
            helperText={touched.city && errors.city}
          />
          <Autocomplete
            id="states-list-autocomplete"
            fullWidth
            options={allStatesList}
            onChange={(e, value) => {
              const state = value?.abbreviation || '';
              return handleInputChange('state', state);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="US State" variant="standard" />}
          />
          <TextField
            required
            fullWidth
            label="Zip code"
            variant="standard"
            value={project.zip}
            className={classes.textField}
            error={touched.zip && !!errors.zip}
            helperText={touched.zip && errors.zip}
            onChange={(e) => handleInputChange('zip', e.target.value)}
          />
        </Box>
        <Box className={classnames(classes.rowContainer, classes.marginBottom)}>
          <TextField
            required
            fullWidth
            label="Unit price"
            variant="standard"
            value={project.price}
            className={classes.textField}
            error={touched.price && !!errors.price}
            helperText={touched.price && errors.price}
            onChange={(e) => {
              handleInputChange('price', e.target.value);
            }}
          />
          <TextField
            required
            fullWidth
            variant="standard"
            label="Max Attendees"
            value={project.max_attendees}
            className={classes.textField}
            error={touched.max_attendees && !!errors.max_attendees}
            helperText={touched.max_attendees && errors.max_attendees}
            onChange={(e) => handleInputChange('max_attendees', e.target.value)}
          />
        </Box>
        <TextField
          fullWidth
          required
          className={classes.textField}
          label="Description"
          variant="outlined"
          multiline
          minRows={3}
          value={project.comments}
          onChange={(e) => handleInputChange('comments', e.target.value)}
        />
        <Box className={classnames(classes.rowContainer, classes.gutterBottom)}>
          <Autocomplete
            id="selected-event"
            multiple
            fullWidth
            options={SKILLS_REQUIRED_OPTIONS}
            onChange={(e, value) => {
              // value here is an array of items
              return handleInputChange('skills_required', value);
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Volunteering" variant="standard" />}
          />
        </Box>
        <Box className={classes.rowContainer}>
          <TextField
            fullWidth
            required
            label="Start DateTime"
            variant="standard"
            type="datetime-local"
            value={project.start_date}
            className={classes.textField}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            error={touched.start_date && !!errors.start_date}
            helperText={touched.start_date && errors.start_date}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            required
            className={classes.textField}
            label="Effort hours"
            placeholder="total labor hours required"
            variant="standard"
            value={project.required_total_man_hours}
            onChange={(e) => handleInputChange('required_total_man_hours', e.target.value)}
            error={touched.required_total_man_hours && !!errors.required_total_man_hours}
            helperText={touched.required_total_man_hours && errors.required_total_man_hours}
            InputProps={{
              endAdornment: (
                <Tooltip title="total labor hours required for the event">
                  <ErrorOutlineRounded />
                </Tooltip>
              ),
            }}
          />
        </Box>
        <Box>
          <Button
            className={classes.addButton}
            variant="text"
            color="primary"
            type="submit"
            disabled={!isFormValid()}
            onClick={() => handleNavigation('/')}
          >
            Add Event
          </Button>
        </Box>
      </form>
    </div>
  );
};

AddCommunityEvent.defaultProps = {
  setEditMode: () => {},
};

AddCommunityEvent.propTypes = {
  setEditMode: PropTypes.func,
};

export default AddCommunityEvent;
