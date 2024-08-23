import { Button, Card, CardActions, CardContent, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { STATUS_OPTIONS } from '../../Notes/constants';

dayjs.extend(relativeTime);

export default function CategoryItemCard({ selectedCategory }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="flex-start">
          <IconButton size="small">
            <FavoriteIcon fontSize="small" sx={{ color: selectedCategory.color }} />
          </IconButton>
          <Typography gutterBottom variant="h5" component="div">
            {selectedCategory.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {selectedCategory.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: "center" }}>
        <Typography variant="caption">Last updated {dayjs(selectedCategory?.updated_at).fromNow()}</Typography>
        <Stack direction="row" alignItems="center">
          <Button size="small">Share</Button>
          <Tooltip title={`Status: ${STATUS_OPTIONS.find((v) => v.label.toLowerCase() === selectedCategory?.status_name)?.display}`}>
              {STATUS_OPTIONS.find((v) => v.label.toLowerCase() === selectedCategory?.status_name)?.icon}
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}