import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import UserNavigator from './UserNavigator';
import LibrarianNavigator from './LibrarianNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {token, userRole} = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          // Auth Stack
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
          // App Stack - Role'e göre yönlendirme
          <>
            {userRole === 'librarian' ? (
              <Stack.Screen
                name="LibrarianHome"
                component={LibrarianNavigator}
                options={{
                  headerShown: false,
                }}
              />
            ) : (
              <Stack.Screen
                name="UserHome"
                component={UserNavigator}
                options={{
                  headerShown: false,
                }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
