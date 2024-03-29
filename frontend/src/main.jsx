import React, { useEffect, useState } from 'react';
import { store } from './Store';
import steps from './tour/steps';
import * as ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { primary_theme } from './util/Theme';
import { TourProvider } from '@reactour/tour';
import { SnackbarProvider } from 'notistack';
import AuthHome from './Containers/Auth/AuthHome';
import { ThemeProvider } from '@material-ui/styles';
import { router } from './util/router';

const ApplicationValidator = () => {
  const { loading } = useSelector((state) => state.auth);
  const [loggedInUser, setLoggedInUser] = useState(false);

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      setLoggedInUser(false);
      return;
    } else {
      setLoggedInUser(true);
    }
  }, [loading]);

  return loggedInUser ? (
    <TourProvider steps={steps}>
      <SnackbarProvider
        dense
        preventDuplicate
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={3000}
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </TourProvider>
  ) : (
    <AuthHome />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={primary_theme}>
    <Provider store={store}>
      <ApplicationValidator />
    </Provider>
  </ThemeProvider>
);
