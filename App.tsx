/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import AppNavigator from './src/routes/AppNavigator';
import {notificationListener} from './src/services/NotificationService';
import {requestUserPermission} from './src/services/NotificationService';

function App(): React.JSX.Element {
  useEffect(() => {
    // Firebase bildirim izinlerini iste ve dinleyicileri başlat
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
