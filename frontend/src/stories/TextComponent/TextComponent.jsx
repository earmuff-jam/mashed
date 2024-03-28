import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import LoadingSkeleton from '../../util/LoadingSkeleton';

const TextComponent = ({ fullWidth, textStyle, loading, gutterBottom, value, variant }) => {
  if (loading) {
    return <LoadingSkeleton width={`calc(100% - 1rem)`} height={'2rem'} />;
  }
  return (
    <Typography fullWidth={fullWidth} className={textStyle} gutterBottom={gutterBottom} variant={variant}>
      {value}
    </Typography>
  );
};

TextComponent.defaultProps = {
  textStyle: '',
  loading: true,
  fullWidth: true,
  gutterBottom: true,
  variant: 'text',
  color: '',
  value: 'John Doe',
};

TextComponent.propTypes = {
  textStyle: PropTypes.string,
  gutterBottom: PropTypes.bool,
  variant: PropTypes.string,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  value: PropTypes.string,
};

export default TextComponent;
