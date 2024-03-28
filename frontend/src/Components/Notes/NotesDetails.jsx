import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextComponent from '../../stories/TextComponent/TextComponent';
import { DeleteRounded, EditRounded, ExpandMoreRounded } from '@material-ui/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Dialog, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSkeleton from '../../util/LoadingSkeleton';
import EmptyComponent from '../../util/EmptyComponent';
import Title from '../DialogComponent/Title';
import AddNote from './AddNote';
import { profileActions } from '../../Containers/Profile/profileSlice';
import { enqueueSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  content: {
    padding: theme.spacing(1),
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100vw', // set width to force inside content to be 100%
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  spacer: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  textVariant: {
    fontWeight: 'bold',
  },
  colorVariant: {
    backgroundColor: theme.palette.secondary.main,
  },
  gapVariant: {
    gap: theme.spacing(1),
  },
}));

/**
 * Takes array of notes and transforms them into objects categorized by the date and time
 *
 * Recently updated - Up to the last week
 * Last Week - Up to the previous week
 * Last month and beyond - everything else
 *
 * @param {Array} notes
 * @returns {Array} refactored notes
 */
export const categorizeNotes = (notes) => {
  const currentTime = new Date();
  const categorizedNotes = notes.reduce((acc, item) => {
    const updatedTime = new Date(item.updated_at);
    const differenceInDays = Math.floor((currentTime - updatedTime) / (1000 * 3600 * 24));

    let category;
    if (differenceInDays <= 7) {
      category = 'Recently added notes';
    } else if (differenceInDays <= 14) {
      category = 'Last Week';
    } else {
      category = 'Last Month and Beyond';
    }

    if (!acc[category]) {
      acc[category] = {
        id: acc.length + 1,
        category: category,
        totalNotes: 0,
        details: [],
      };
    }

    acc[category].details.push({
      id: acc[category].details.length + 1,
      noteID: item.noteID,
      note_title: item.title,
      note_description: item.description,
      updated_by: item.updated_by,
      updated_at: item.updated_at,
      updator: item.updator,
    });

    acc[category].totalNotes++;
    return acc;
  }, {});

  return Object.values(categorizedNotes);
};

const NotesDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);

  const { loading, notes } = useSelector((state) => state.profile);

  const [editNote, setEditNote] = useState(false);
  const [selecteNoteID, setSelectedNoteID] = useState('');
  const [formattedNotes, setFormattedNotes] = useState([]);

  const removeSelectedNote = (noteID) => {
    const formattedNotes = notes.filter((v) => v.noteID != noteID);
    const formattedDraftNotes = {
      noteID: noteID,
      updated_by: localStorage.getItem('userID'),
    };
    dispatch(profileActions.removeSelectedNote(formattedDraftNotes));
    const transformedData = categorizeNotes(formattedNotes);
    setFormattedNotes(transformedData);
    enqueueSnackbar('Successfully removed notes.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (Array.isArray(notes) && notes.length >= 0) {
      const transformedData = categorizeNotes(notes);
      setFormattedNotes(transformedData);
    }
  }, [loading]);

  if (loading) {
    return <LoadingSkeleton height={'10rem'} width={'10rem'} />;
  }

  if (!notes || notes.length === 0) {
    return <EmptyComponent subtitle="Add new notes." />;
  }

  return (
    <div className={classes.root}>
      {formattedNotes.map((v) => (
        <Accordion elevation={0} className={classes.colorVariant}>
          <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
            <Box className={[classes.rowContainer, classes.gapVariant].join(' ')}>
              <TextComponent textStyle={classes.heading} value={v.category} loading={loading} />
              <Chip label={v.totalNotes} size="small" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box className={classes.contentContainer}>
              {v.details.map((note) => (
                <Box className={classes.content}>
                  <Box className={classes.rowContainer}>
                    <TextComponent
                      value={note.note_title}
                      gutterBottom={true}
                      fullWidth={true}
                      loading={loading}
                      textStyle={[classes.text, classes.textVariant].join(' ')}
                    />
                    <Box className={classes.spacer}></Box>
                    <IconButton
                      onClick={() => {
                        removeSelectedNote(note.noteID);
                      }}
                    >
                      <DeleteRounded />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEditNote(true);
                        setSelectedNoteID(note.noteID);
                      }}
                    >
                      <EditRounded />
                    </IconButton>
                  </Box>
                  {editNote && (
                    <Dialog open={editNote} width={'md'} fullWidth={true}>
                      <Title onClose={() => setEditNote(false)}>Edit Note</Title>
                      <AddNote editMode={editNote} setEditMode={setEditNote} noteID={selecteNoteID} />
                    </Dialog>
                  )}
                  <Box>
                    <TextComponent textStyle={classes.heading} value={note.note_description} loading={loading} />
                    <Box className={classes.rowContainer}>
                      <TextComponent textStyle={classes.heading} value={note.updator} loading={loading} />
                      <Box className={classes.spacer}></Box>
                      <TextComponent
                        textStyle={classes.heading}
                        value={dayjs(note.updated_at).fromNow()}
                        loading={loading}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default NotesDetails;
