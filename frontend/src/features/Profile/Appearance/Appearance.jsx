import { Box, Button, Checkbox, Divider, FormControlLabel, Skeleton, Stack, Typography } from '@mui/material';
import { DarkModeRounded, GridViewRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
// import dayjs from 'dayjs';

const AppearanceSettings = () => {
  const data = {};
  const isLoading = false;
  const [displayMode, setDisplayMode] = useState(false);
  const [inventoryLayout, setInventoryLayout] = useState(false); // false is list view

  const handleSubmit = () => {
    // const draftFormattedData = {
    //   // id: user?.id,
    //   display_mode: displayMode,
    //   inventory_layout: inventoryLayout,
    //   // updated_by: user?.id,
    //   updated_on: dayjs(),
    // };
    // upsertProfileConfigDetailsMutation.mutate(draftFormattedData);
    // navigate('/');
  };

  useEffect(() => {
    if (!isLoading) {
      setDisplayMode(data?.display_mode);
      setInventoryLayout(data?.inventory_layout);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Skeleton variant="rounded" animation="wave" height="100%" width="100%" />;
  }
  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Appearance Settings
        </Typography>
        <Typography variant="caption" gutterBottom>
          Change the look and feel of the application. Switch between dark mode and light mode if needed.
        </Typography>
        <Divider />
      </Box>
      <Stack spacing={2}>
        <FormControlLabel
          control={<Checkbox checked={displayMode} onChange={() => setDisplayMode(!displayMode)} color="primary" />}
          label={
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DarkModeRounded color={displayMode ? 'primary' : 'secondary'} />
                <Typography variant="caption">Enable dark mode</Typography>
              </Stack>
              <Typography variant="caption" gutterBottom>
                Switch to dark mode.
              </Typography>
            </Stack>
          }
        />
        <FormControlLabel
          control={
            <Checkbox checked={inventoryLayout} onChange={() => setInventoryLayout(!inventoryLayout)} color="primary" />
          }
          label={
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GridViewRounded color="primary" />
                <Typography variant="caption">Enable grid mode for assets</Typography>
              </Stack>
              <Typography variant="caption" gutterBottom>
                Switch between list view and grid view for viewing assets.
              </Typography>
            </Stack>
          }
        />
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </>
  );
};
export default AppearanceSettings;
