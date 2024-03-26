import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, Tooltip, Typography } from '@material-ui/core';
import { produce } from 'immer';
import { enqueueSnackbar } from 'notistack';
import { ADD_ITEM_FORM_FIELDS } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { eventActions } from '../../Containers/Event/eventSlice';
import ButtonComponent from '../../stories/Button/ButtonComponent';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
    padding: theme.spacing(4),
  },
}));

const filter = createFilterOptions();

const AddItemDetail = ({ eventID, setDisplayMode }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userID = localStorage.getItem('userID');
  const { loading, storageLocations } = useSelector((state) => state.event);

  const [options, setOptions] = useState([]);
  const [storageLocation, setStorageLocation] = useState({});
  const [formFields, setFormFields] = useState(ADD_ITEM_FORM_FIELDS);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormFields(
      produce(formFields, (draft) => {
        draft[name].value = value;
        draft[name].errorMsg = '';

        for (const validator of draft[name].validators) {
          if (validator.validate(value)) {
            draft[name].errorMsg = validator.message;
            break;
          }
        }
      })
    );
  };

  const submit = () => {
    const containsErr = Object.values(formFields).reduce((acc, el) => {
      if (el.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formFields).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => el.value.trim() === '');

    // ensure that the storage location is not empty
    if (containsErr || isRequiredFieldsEmpty || storageLocation === null || Object.keys(storageLocation).length <= 0) {
      enqueueSnackbar('Cannot add new item.', {
        variant: 'error',
      });
      return;
    }

    const formattedData = Object.values(formFields).reduce((acc, el) => {
      if (el.value) {
        if (el.name === 'quantity') {
          acc[el.name] = parseInt(el.value);
        } else {
          acc[el.name] = el.value;
        }
      }
      return acc;
    }, {});
    const storageLocationID =
      storageLocations.find((v) => v.location === storageLocation.storageLocation)?.id ||
      storageLocation.storageLocation;

    const postFillLocation = {
      ...formattedData,
      location: storageLocationID,
      created_by: userID,
      eventID: eventID,
    };
    dispatch(eventActions.addItem(postFillLocation));
    setDisplayMode(0);
    setFormFields(ADD_ITEM_FORM_FIELDS);
    enqueueSnackbar('Successfully added new item.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (!loading && Array.isArray(storageLocations)) {
      setOptions(storageLocations.map((v) => v.location));
    }
  }, [storageLocations, loading]);

  return (
    <div className={classes.container}>
      <Typography variant="caption" color="textSecondary">
        Add item that are required for this event. These items can be shared with other members of the group. Such
        shared items are stored with due process until the group is abandoned or until the creator removes the ability
        to share the items with other members.
      </Typography>
      {Object.values(formFields).map((v, index) => (
        <TextField
          key={index}
          id={v.name}
          name={v.name}
          label={v.label}
          value={v.value}
          placeholder={v.placeholder}
          onChange={handleInput}
          required={v.required}
          fullWidth={v.fullWidth}
          error={!!v.errorMsg}
          helperText={v.errorMsg}
        />
      ))}
      <Autocomplete
        value={storageLocation.inputValue}
        forcePopupIcon
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setStorageLocation({
              storageLocation: newValue,
            });
          } else if (newValue && newValue.inputValue) {
            setStorageLocation({
              storageLocation: newValue.inputValue,
            });
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              location: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="autocomplete-location-details"
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.location || '')}
        renderOption={(option) => option.location || option}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Location"
            variant="standard"
            placeholder="Where you plan to store the item"
          />
        )}
      />
      <Box>
        <Tooltip
          title={
            'Adding items to any event will allow all members to view the item. Any person who is not within that event group must join that group to view the item.'
          }
        >
          <ButtonComponent text={'Submit'} onClick={submit} buttonVariant={'text'} />
        </Tooltip>
      </Box>
    </div>
  );
};

AddItemDetail.defaultProps = {
  eventID: '',
  setDisplayMode: () => {},
};

AddItemDetail.propTypes = {
  eventID: PropTypes.string,
  setDisplayMode: PropTypes.func,
};

export default AddItemDetail;
