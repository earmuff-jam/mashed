import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DeleteRounded, EditRounded, ExpandMoreRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { categorizeNotes, ConfirmationBoxModal, EmptyComponent } from '../common/utils';
import { notesActions } from './notesSlice';
import { STATUS_OPTIONS } from './constants';
import LocationPicker from '../common/Location/LocationPicker';

const NotesDetails = ({ notes, loading, setEditMode, setSelectedNoteID }) => {
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);

  const [deleteID, setDeleteID] = useState(-1);
  const [formattedNotes, setFormattedNotes] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const reset = () => {
    setConfirmDelete(false);
    setDeleteID(-1);
  };

  const handleConfirmDelete = () => {
    removeSelectedNote(deleteID);
    setConfirmDelete(false);
  };

  const removeSelectedNote = (noteID) => {
    dispatch(notesActions.removeNote({ noteID }));
    enqueueSnackbar('Successfully removed notes.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (Array.isArray(notes) && notes.length >= 0) {
      const transformedData = categorizeNotes(notes);
      setFormattedNotes(transformedData);
    }
  }, [loading, notes]);

  if (loading) {
    return <Skeleton width={`calc(100% - 1rem)`} height={'2rem'} />;
  }

  if (!notes || notes.length === 0) {
    return <EmptyComponent subtitle="Add new notes." />;
  }

  return (
    <div>
      {formattedNotes.map((v, index) => (
        <Accordion key={index} elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
            <Stack direction="row" spacing={{ xs: 1 }}>
              <Typography variant="body1">{v.category}</Typography>
              <Chip label={v.totalNotes} size="small" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing="1rem">
              {v.details.map((note, index) => (
                <Stack
                  key={index}
                  sx={{
                    bgcolor: 'secondary.light',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    p: 1,
                    borderRadius: '0.2rem',
                    borderLeft: '0.175rem solid',
                    backgroundColor: 'background.default',
                    borderColor: note.color ? `${note.color}` : 'primary.main',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{note.title}</Typography>
                    <Stack direction="row" alignSelf="flex-end">
                      <IconButton
                        onClick={() => {
                          setConfirmDelete(true);
                          setDeleteID(note.noteID);
                        }}
                        size="small"
                      >
                        <DeleteRounded fontSize="small" color="error" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditMode(true);
                          setSelectedNoteID(note.noteID);
                        }}
                        size="small"
                      >
                        <EditRounded fontSize="small" color="primary" />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Typography variant="body2">{note.description}</Typography>
                  <Stack sx={{ mt: '1rem' }}>
                    <LocationPicker location={note.location} /> {/* Location Picker */}
                  </Stack>
                  <Row>
                    <>
                      <Box>
                        <Typography variant="caption">
                          By {note.updator} {dayjs(note.updated_at).fromNow()}
                        </Typography>
                      </Box>
                      <Tooltip title={STATUS_OPTIONS.find((v) => v.label.toLowerCase() === note.status_name)?.display}>
                        <Stack direction="row" spacing="0.2rem" alignItems="center" alignSelf="flex-end">
                          <Typography variant="caption" alignSelf="flex-end">
                            Status:
                          </Typography>
                          {STATUS_OPTIONS.find((v) => v.label.toLowerCase() === note.status_name)?.icon}
                        </Stack>
                      </Tooltip>
                    </>
                  </Row>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      <ConfirmationBoxModal
        openDialog={confirmDelete}
        title="Confirm deletion"
        text="Confirm deletion of selected note? Deletion is permanent and cannot be undone."
        textVariant="body2"
        handleClose={reset}
        maxSize="sm"
        deleteID={deleteID}
        confirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

const Row = ({ children }) => {
  return (
    <Stack direction="row" spacing="0.2rem" alignItems="center" justifyContent="space-between">
      {children}
    </Stack>
  );
};

export default NotesDetails;
