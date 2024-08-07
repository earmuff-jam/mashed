import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextFieldComponent from '../TextFieldComponent/TextComponent';
import { Box, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ChipComponent from '../ChipComponent/ChipComponent';

const useStyles = makeStyles((theme) => ({
  headerText: {
    fontSize: '1.6rem',
    letterSpacing: '0.0125rem',
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.error.main,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  errorText: {
    color: theme.palette.error.dark,
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
  extraSubtitle: {
    fontSize: '0.725rem',
    fontWeight: 'bold',
    overflowWrap: 'anywhere',
  },
  centerContent: {
    display: 'flex',
    alignItems: 'center',
  },
  userProfileDetailsContainer: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  ellipsisContainer: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const CardTitleComponent = ({
  firstIcon,
  firstToolTipLabel,
  firstLabel,
  secondIcon,
  secondLabel,
  secondTooltipLabel,
  titleText,
  titleTooltip,
  extraSubtitle,
  isLoading,
  editMode,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.userProfileDetailsContainer}>
      <Box className={[classes.rowContainer, classes.ellipsisContainer].join(' ')} data-tour="1">
        <Tooltip title={titleTooltip}>
          <Typography className={[classes.headerText, classes.ellipsisContainer].join(' ')}>
            {editMode ? `Editing ${titleText}` : titleText}
          </Typography>
        </Tooltip>
        <Box className={classNames(classes.rowContainer, classes.centerContent)} data-tour="5">
          <Tooltip title={firstToolTipLabel}>
            <Box>
              <ChipComponent icon={firstIcon} variant={'default'} label={firstLabel} size={'small'} />
            </Box>
          </Tooltip>
          <Tooltip title={secondTooltipLabel}>
            <Box>
              <ChipComponent icon={secondIcon} variant={'default'} label={secondLabel} size={'small'} />
            </Box>
          </Tooltip>
        </Box>
      </Box>
      <Box data-tour="2">
        <TextFieldComponent textStyle={classes.extraSubtitle} loading={isLoading} value={extraSubtitle} />
      </Box>
    </Box>
  );
};

CardTitleComponent.defaultProps = {
  firstIcon: {},
  firstLabel: '',
  firstToolTipLabel: '',
  secondIcon: {},
  secondLabel: '',
  secondTooltipLabel: '',
  titleText: '',
  titleTooltip: '',
  extraSubtitle: '',
  isLoading: true,
  editMode: true,
};

CardTitleComponent.propTypes = {
  titleText: PropTypes.string,
  titleTooltip: PropTypes.string,
  firstIcon: PropTypes.object,
  firstLabel: PropTypes.string,
  secondIcon: PropTypes.object,
  secondLabel: PropTypes.string,
  extraSubtitle: PropTypes.string,
  firstToolTipLabel: PropTypes.string,
  secondTooltipLabel: PropTypes.string,
  isLoading: PropTypes.bool,
  editMode: PropTypes.bool,
};

export default CardTitleComponent;
