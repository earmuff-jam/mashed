import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import LoadingSkeleton from '../../util/LoadingSkeleton';

const TextComponent = ({ fullWidth, textStyle, loading, gutterBottom, value }) => {
  if (loading) {
    return <LoadingSkeleton width={`calc(100% - 1rem)`} height={'2rem'} />;
  }
  return (
    <Typography fullWidth={fullWidth} className={textStyle} gutterBottom={gutterBottom}>
      {value}
    </Typography>
  );
};

TextComponent.defaultProps = {
  textStyle: '',
  loading: true,
  fullWidth: true,
  gutterBottom: true,
  value: 'John Doe',
};

TextComponent.propTypes = {
  textStyle: PropTypes.string,
  gutterBottom: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  value: PropTypes.string,
};

export default TextComponent;
