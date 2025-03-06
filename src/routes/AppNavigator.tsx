import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import UserHomeScreen from '../screens/user/UserHomeScreen';
import LibrarianHomeScreen from '../screens/librarian/LibrarianHomeScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

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
                component={LibrarianHomeScreen}
                options={{
                  title: 'Kütüphaneci Paneli',
                  headerLeft: () => null,
                }}
              />
            ) : (
              <Stack.Screen
                name="UserHome"
                component={UserHomeScreen}
                options={{
                  title: 'Kullanıcı Paneli',
                  headerLeft: () => null,
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
