import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {token} = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen
              name="RoleSelection"
              component={RoleSelectionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          // Burada daha sonra eklenecek olan ana ekranlar gelecek
          <></>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
