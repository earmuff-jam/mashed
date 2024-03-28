import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Box } from '@material-ui/core';
import relativeTime from 'dayjs/plugin/relativeTime';
import { makeStyles } from '@material-ui/core/styles';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent,
} from '@material-ui/lab';
import { CreateNewFolderRounded, LocalAtmRounded, TrackChangesRounded } from '@material-ui/icons';
import TextComponent from '../../stories/TextComponent/TextComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2),
    gap: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(0.4),
  },
  timelineContainer: {
    display: 'flex',
    '& .MuiTimeline-root': {
      flexGrow: 0,
    },
  },
  timelineRoot: {
    display: 'none',
  },
  timelineItem: {
    minHeight: 0,
  },
  timelineDot: {
    backgroundColor: theme.palette.error.main,
    border: 'none',
  },
  timelineDotPrimary: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
  },
  subtitleTextHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: '0.725rem',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    overflow: 'auto',
    paddingBottom: theme.spacing(1.2),
  },
  chip: {
    fontSize: theme.spacing(1.5),
  },
  iconWithText: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: '0.825rem',
    overflowWrap: 'anywhere',
    marginTop: theme.spacing(1),
  },
  activityDescription: {
    fontSize: theme.spacing(1.5),
  },
}));

const RecentActivity = ({ activity }) => {
  const classes = useStyles();
  dayjs.extend(relativeTime);
  return (
    <Box className={classes.root}>
      <Box className={classes.timelineContainer}>
        <Timeline align="left">
          <TimelineItem className={classes.timelineItem}>
            <TimelineOppositeContent classes={{ root: classes.timelineRoot }} />
            <TimelineSeparator>
              <TimelineDot className={classNames(classes.timelineDot, classes.timelineDotPrimary)}>
                <CreateNewFolderRounded />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent className={classes.text}>{activity.title}</TimelineContent>
          </TimelineItem>

          {activity.volunteering_hours > 0 ? (
            <TimelineItem className={classes.timelineItem}>
              <TimelineOppositeContent classes={{ root: classes.timelineRoot }} />
              <TimelineSeparator>
                <TimelineDot className={classes.timelineDot}>
                  <TrackChangesRounded />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent className={classes.text}>
                Volunteered on {activity?.volunteering_skill.length} skill for {activity.volunteering_hours} hours
              </TimelineContent>
            </TimelineItem>
          ) : null}

          {activity.skills_required > 0 ? (
            <TimelineItem className={classes.timelineItem}>
              <TimelineOppositeContent classes={{ root: classes.timelineRoot }} />
              <TimelineSeparator>
                <TimelineDot className={classNames(classes.timelineDot, classes.timelineDotPrimary)} />
              </TimelineSeparator>
              <TimelineContent>Requested help on {activity?.skills_required.length} skills</TimelineContent>
            </TimelineItem>
          ) : null}

          {activity?.expense_name?.length >= 1 ? (
            <TimelineItem className={classes.timelineItem}>
              <TimelineOppositeContent classes={{ root: classes.timelineRoot }} />
              <TimelineSeparator>
                <TimelineDot className={classes.timelineDot}>
                  <LocalAtmRounded />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent className={classes.text}>
                Expenses listed on {activity?.expense_name.length} items
              </TimelineContent>
            </TimelineItem>
          ) : null}
        </Timeline>
      </Box>
      <TextComponent
        gutterBottom={true}
        loading={false}
        textStyle={classes.subtitleTextHeader}
        value={`Event updated around ${dayjs(activity?.updated_at).fromNow()} by ${activity?.updator}`}
      />
    </Box>
  );
};

RecentActivity.defaultProps = {
  activity: {},
};

RecentActivity.propTypes = {
  activity: PropTypes.object,
};

export default RecentActivity;
