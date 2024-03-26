import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SaveRounded } from '@material-ui/icons';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  disableHover: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiButton-endIcon': {
      margin: theme.spacing(0),
    },
  },
}));

const ButtonComponent = ({
  text,
  buttonVariant,
  buttonStyles,
  showIcon,
  icon,
  disabled,
  disableRipple,
  disableFocusRipple,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <Button
      className={classNames(buttonStyles, { [classes.disableHover]: disableRipple })}
      variant={buttonVariant}
      disabled={disabled}
      disableRipple={disableRipple}
      disableFocusRipple={disableFocusRipple}
      endIcon={showIcon ? icon : null}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

ButtonComponent.defaultProps = {
  text: 'Mashed',
  buttonVariant: 'outlined',
  showIcon: false,
  icon: <SaveRounded />,
  disabled: false,
  disableRipple: false,
  disableFocusRipple: false,
  buttonStyles: '',
  onClick: () => {},
};

ButtonComponent.propTypes = {
  text: PropTypes.string,
  buttonStyles: PropTypes.string,
  buttonVariant: PropTypes.string,
  showIcon: PropTypes.bool,
  icon: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  disableRipple: PropTypes.bool,
  disableFocusRipple: PropTypes.bool,
};

export default ButtonComponent;
