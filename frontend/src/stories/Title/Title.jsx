import classNames from 'classnames';
import PropTypes from 'prop-types';
import Subtitle from '../Subtitle/Subtitle';
import { EmojiPeopleRounded } from '@material-ui/icons';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: '1.2rem',
    fontWeight: 'lighter',
    marginBottom: theme.spacing(2),
  },
  header: {
    fontSize: '1.6rem',
    letterSpacing: '0.0125rem',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  errorText: {
    color: theme.palette.error.dark,
  },
}));

const Title = ({ title, headingVariant, displaySubtitle, titleStyle }) => {
  const classes = useStyles();

  return (
    <>
      <Typography
        className={classNames(classes.header, titleStyle, { [classes.errorText]: headingVariant === 'error' })}
      >
        {title}
      </Typography>
      {displaySubtitle ? (
        <Subtitle
          subtitle={
            'Sign up to be updated with events around your community. You can lend a hand, or even ask for one.'
          }
          showIcon={true}
          icon={<EmojiPeopleRounded />}
        />
      ) : null}
    </>
  );
};

Title.defaultProps = {
  title: 'Find meaning to volunteer',
  headingVariant: 'error',
  displaySubtitle: false,
  titleStyle: '', // titleStyle overrides the classes.header since it is cascading styles
};

Title.propTypes = {
  title: PropTypes.string,
  headingVariant: PropTypes.string,
  displaySubtitle: PropTypes.bool,
  titleStyle: PropTypes.string, // this is className with jsx
};

export default Title;
