import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, View} from 'react-native';
import LibrarianDashboardScreen from '../screens/librarian/LibrarianDashboardScreen';
import BookManagementScreen from '../screens/librarian/BookManagementScreen';
import LoanManagementScreen from '../screens/librarian/LoanManagementScreen';
import LibrarianProfileScreen from '../screens/librarian/LibrarianProfileScreen';
import ReturnBookScreen from '../screens/librarian/ReturnBookScreen';
import {
  dashboard,
  books,
  loan_management,
  user,
  return_book,
} from '../assets/icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LoanStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LoanManagementMain"
        component={LoanManagementScreen}
      />
      <Stack.Screen name="ReturnBook" component={ReturnBookScreen} />
    </Stack.Navigator>
  );
};

const LibrarianNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#121921',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#A28D4F',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarBackground: () => (
          <View style={{backgroundColor: '#121921', flex: 1}} />
        ),
      }}>
      <Tab.Screen
        name="Dashboard"
        component={LibrarianDashboardScreen}
        options={{
          tabBarLabel: 'Panel',
          tabBarIcon: ({color}) => (
            <Image
              source={dashboard}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BookManagement"
        component={BookManagementScreen}
        options={{
          tabBarLabel: 'Kitaplar',
          tabBarIcon: ({color}) => (
            <Image
              source={books}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LoanManagement"
        component={LoanManagementScreen}
        options={{
          tabBarLabel: 'Ödünç',
          tabBarIcon: ({color}) => (
            <Image
              source={loan_management}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ReturnBook"
        component={ReturnBookScreen}
        options={{
          tabBarLabel: 'İade İşlemi',
          tabBarIcon: ({color}) => (
            <Image
              source={return_book}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={LibrarianProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color}) => (
            <Image
              source={user}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default LibrarianNavigator;
