import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CircularProgress,
  CssBaseline,
  IconButton,
  Skeleton,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Suspense, useEffect } from 'react';
import MenuActionBar from './MenuActionBar';
import { darkTheme, lightTheme } from '../../util/Theme';
import { LogoutRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../Containers/Auth/authSlice';
import { profileActions } from '../Profile/profileSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { loading, profileDetails } = useSelector((state) => state.profile);

  const handleLogout = () => {
    dispatch(authActions.getLogout());
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
    dispatch(profileActions.getProfileDetails());
  }, []);

  if (loading) {
    return <Skeleton width="100%" height="100%" />;
  }

  return (
    <ThemeProvider theme={profileDetails.appearance ? darkTheme : lightTheme}>
      <CssBaseline />
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress color="inherit" />
          </Box>
        }
      >
        <AppBar color="secondary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AssetAlert
            </Typography>
            <Tooltip title="log out">
              <IconButton onClick={handleLogout}>
                <LogoutRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box>
          <Stack direction="row" spacing="1rem" sx={{ mt: '5rem' }}>
            <MenuActionBar />
            <Stack sx={{ py: '1rem', flexGrow: 1 }}>
              <Outlet />
            </Stack>
          </Stack>
        </Box>
      </Suspense>
    </ThemeProvider>
  );
};

export default Layout;
