import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView, StatusBar, View, StyleSheet} from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import UserNavigator from './UserNavigator';
import LibrarianNavigator from './LibrarianNavigator';
import NotificationScreen from '../screens/user/NotificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121921"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {!token ? (
              // Auth stack
              <Stack.Group>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </Stack.Group>
            ) : (
              // Role'e göre yönlendirme yap
              <>
                {userRole === 'librarian' ? (
                  <Stack.Screen
                    name="LibrarianTabs"
                    component={LibrarianNavigator}
                  />
                ) : (
                  <Stack.Screen name="UserTabs" component={UserNavigator} />
                )}
              </>
            )}
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121921',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#121921',
  },
});

export default AppNavigator;
