import AddNote from './AddNote';
import NotesDetails from './NotesDetails';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack, Typography } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { notesActions } from './notesSlice';
import SimpleModal from '../common/SimpleModal';

const Notes = () => {
  const dispatch = useDispatch();
  const { loading, notes } = useSelector((state) => state.notes);

  const [editMode, setEditMode] = useState(false);
  const [selecteNoteID, setSelectedNoteID] = useState(null);

  const handleEditMode = () => setEditMode(!editMode);

  const resetData = () => {
    setEditMode(false);
    setSelectedNoteID(null);
  };

  useEffect(() => {
    dispatch(notesActions.getNotes());
  }, []);

  return (
    <Stack spacing="1rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          Rough Notes
        </Typography>
        <Button startIcon={<AddRounded />} onClick={handleEditMode} variant='outlined'>
          Add note
        </Button>
      </Stack>
      {editMode && (
        <SimpleModal
          title="Add New Note"
          subtitle={'Assigned locations are approximate values.'}
          handleClose={resetData}
          maxSize="sm"
        >
          <AddNote
            setEditMode={setEditMode}
            setSelectedNoteID={setSelectedNoteID}
            noteID={selecteNoteID}
            notes={notes}
          />
        </SimpleModal>
      )}
      <NotesDetails notes={notes} loading={loading} setEditMode={setEditMode} setSelectedNoteID={setSelectedNoteID} />
    </Stack>
  );
};

export default Notes;
