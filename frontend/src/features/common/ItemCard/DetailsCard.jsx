import { Badge, Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ShareRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { profileActions } from '../../Profile/profileSlice';
import { useEffect, useState } from 'react';
import SimpleModal from '../SimpleModal';
import SharableGroups from '../SharableGroups';
import { categoryActions } from '../../Categories/categoriesSlice';
import { produce } from 'immer';
import { maintenancePlanActions } from '../../Maintenance/maintenanceSlice';

dayjs.extend(relativeTime);

export default function DetailsCard({ selectedItem, isViewingCategory = false }) {
  const dispatch = useDispatch();
  const { favItems = [] } = useSelector((state) => state.profile);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const isFavourite = favItems.some(
    (v) => v.category_id === selectedItem.id || v.maintenance_plan_id === selectedItem.id
  );

  const isShared = selectedItem?.sharable_groups?.length > 1 || false;

  const updateCollaborators = (sharableGroups) => {
    const newMembers = sharableGroups.map((v) => v.value);
    const draftSelectionDetails = produce(selectedItem, (draft) => {
      draft.sharable_groups = newMembers;
      if (isViewingCategory) {
        draft.status = draft.status_name;
      } else {
        draft.maintenance_status = draft.maintenance_status_name;
      }
    });
    if (isViewingCategory) {
      dispatch(categoryActions.updateCategory(draftSelectionDetails));
    } else {
      dispatch(maintenancePlanActions.updatePlan(draftSelectionDetails));
    }
  };

  const handleFavItem = (_, selectedID, isFavourite) => {
    let draftFavItem = {};
    if (isViewingCategory) {
      draftFavItem = { category_id: selectedID };
    } else {
      draftFavItem = { maintenance_plan_id: selectedID };
    }

    if (isFavourite) {
      // toggle fav off if exists
      const currentItems = favItems.filter((v) => v.category_id === selectedID || v.maintenance_plan_id === selectedID);
      const currentItem = currentItems.find(() => true);
      dispatch(profileActions.removeFavItem(currentItem?.id));
    } else {
      dispatch(profileActions.saveFavItem(draftFavItem));
    }
  };

  useEffect(() => {
    dispatch(profileActions.getFavItems({ limit: 1000 }));
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="flex-start">
            <IconButton size="small" onClick={(ev) => handleFavItem(ev, selectedItem.id, isFavourite)}>
              <FavoriteIcon fontSize="small" sx={{ color: isFavourite ? selectedItem.color : 'secondary.main' }} />
            </IconButton>
            <Typography gutterBottom variant="h5" component="div">
              {selectedItem.name}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {selectedItem.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}
        >
          <Typography variant="caption">Last updated {dayjs(selectedItem?.updated_at).fromNow()}</Typography>
          <Stack direction="row" alignItems="center">
            <Badge
              badgeContent={isShared ? selectedItem?.sharable_groups.length - 1 : 0} // account for creator in sharable_groups
              color="secondary"
              max={10}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Button size="small" endIcon={<ShareRounded />} onClick={handleOpenModal}>
                Share
              </Button>
            </Badge>
          </Stack>
        </CardActions>
      </Card>
      {openModal && (
        <SimpleModal
          title="Add sharable groups"
          subtitle="Assign users as collaborators to selected item."
          handleClose={handleCloseModal}
          maxSize="sm"
        >
          <SharableGroups handleSubmit={updateCollaborators} existingGroups={selectedItem?.sharable_groups || []} />
        </SimpleModal>
      )}
    </>
  );
}
