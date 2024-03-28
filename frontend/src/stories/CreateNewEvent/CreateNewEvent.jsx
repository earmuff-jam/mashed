import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChipComponent from '../Chip/ChipComponent';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Dialog, Divider } from '@material-ui/core';
import ButtonComponent from '../Button/ButtonComponent';
import TextComponent from '../TextComponent/TextComponent';
import Title from '../../Components/DialogComponent/Title';
import AddCommunityEvent from '../../Components/CommunityEvent/AddCommunityEvent';
import { AddCircleRounded, ContactMailRounded, ViewListRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
  titleText: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  text: {
    fontSize: '0.925rem',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    padding: theme.spacing(1),
  },
}));

const CreateNewEvent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { loading: userNameLoading, username } = useSelector((state) => state.home);

  const [editMode, setEditMode] = useState(false);
  const handleClick = () => setEditMode(!editMode);

  return (
    <Box className={classes.container} data-tour="1">
      <TextComponent
        gutterBottom={true}
        loading={userNameLoading}
        textStyle={classes.titleText}
        value={username?.length > 0 ? `Welcome ${username} !` : 'Welcome User !'}
      />
      <TextComponent
        gutterBottom={true}
        loading={false}
        textStyle={classes.text}
        value={`Create new event or volunteer for any existing event. Monitor inventory and track expense reports. View all
        items associated with selected event or even maintain your own personal inventory list.`}
      />
      <Divider />
      <Box className={classes.chipContainer}>
        <ChipComponent
          variant={'outlined'}
          icon={<ViewListRounded />}
          label={'Inventory'}
          disabled={true}
          onClick={() => navigate('/profile')}
        />
      </Box>
      <TextComponent
        gutterBottom={true}
        loading={false}
        textStyle={classes.text}
        value={`Browse other events around you to volunteer, or jump right in to create new event. Add personal inventories for
        audit or even explore options to change your profile and avatars.`}
      />
      <Box data-tour="3">
        <ButtonComponent
          text={'Create Event'}
          showIcon={true}
          buttonVariant={'text'}
          disableRipple={true}
          icon={<AddCircleRounded />}
          disableFocusRipple={true}
          onClick={handleClick}
          disabled={false}
        />
        <ButtonComponent
          text={'View profile'}
          showIcon={true}
          buttonVariant={'text'}
          disableRipple={true}
          icon={<ContactMailRounded />}
          disableFocusRipple={true}
          onClick={() => navigate('/profile')}
          disabled={false}
        />
      </Box>
      {editMode && (
        <Dialog open={editMode} width={'md'} fullWidth={true}>
          <Title onClose={() => setEditMode(false)}>Add New Event</Title>
          <AddCommunityEvent setEditMode={setEditMode} />
        </Dialog>
      )}
    </Box>
  );
};

export default CreateNewEvent;
