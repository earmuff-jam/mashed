import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@material-ui/core';
import { produce } from 'immer';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import ButtonComponent from '../../stories/Button/ButtonComponent';
import { ADD_NOTES_FORM_FIELDS } from './constants';
import { AddRounded } from '@material-ui/icons';
import { profileActions } from '../../Containers/Profile/profileSlice';
import TextComponent from '../../stories/TextComponent/TextComponent';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(6),
    padding: theme.spacing(4),
  },
}));

const AddNote = ({ setEditMode, noteID }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, notes } = useSelector((state) => state.profile);
  const [formFields, setFormFields] = useState(ADD_NOTES_FORM_FIELDS);

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

    const userID = localStorage.getItem('userID');
    const requiredFormFields = Object.values(formFields).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => el.value.trim() === '');

    if (containsErr || isRequiredFieldsEmpty) {
      enqueueSnackbar('Cannot add new item.', {
        variant: 'error',
      });
      return;
    }

    const formattedNotes = Object.values(formFields).reduce((acc, el) => {
      if (el.value) {
        acc['noteID'] = noteID;
        acc[el.name] = el.value;
      }
      return acc;
    }, {});

    const formattedDraftNotes = {
      ...formattedNotes,
      updated_by: userID,
    };

    // existing noteID support edit mode only
    if (noteID) {
      dispatch(profileActions.updateExistingNote(formattedDraftNotes));
    } else {
      dispatch(profileActions.addNewNote(formattedDraftNotes));
    }

    setEditMode(false);
    setFormFields(ADD_NOTES_FORM_FIELDS);
    enqueueSnackbar('Successfully added new item.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    // if noteID exists, we are updating the note
    if (!loading && noteID) {
      const selectedNote = notes.filter((v) => v.noteID === noteID);
      const draftNote = selectedNote[0];
      const draftFormFields = { ...formFields };
      draftFormFields.title.value = draftNote?.title || '';
      draftFormFields.description.value = draftNote?.description || '';
      setFormFields(draftFormFields);
    }
  }, [noteID]);

  return (
    <Box className={classes.container}>
      <TextComponent
        value={'Write what are you thinking ...'}
        gutterBottom={true}
        loading={loading}
        variant={'caption'}
      />
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
      <Box>
        <ButtonComponent text={'Add'} onClick={submit} buttonVariant={'text'} icon={<AddRounded />} showIcon={true} />
      </Box>
    </Box>
  );
};

AddNote.defaultProps = {
  setEditMode: () => {},
  noteID: '',
};

AddNote.propTypes = {
  setEditMode: PropTypes.func,
  noteID: PropTypes.string,
};

export default AddNote;
