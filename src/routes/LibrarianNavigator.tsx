import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {dashboard, user, loan_management} from '../assets/icons';
import LibrarianDashboardScreen from '../screens/librarian/LibrarianDashboardScreen';
import BookManagementScreen from '../screens/librarian/BookManagementScreen';
import LoanManagementScreen from '../screens/librarian/LoanManagementScreen';

const Tab = createBottomTabNavigator();

const LibrarianNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#121921',
        tabBarInactiveTintColor: '#999999',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={LibrarianDashboardScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({focused}) => (
            <Image
              source={dashboard}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#121921' : '#999999',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BookManagement"
        component={BookManagementScreen}
        options={{
          tabBarLabel: 'Kitap Yönetimi',
          tabBarIcon: ({focused}) => (
            <Image
              source={user}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#121921' : '#999999',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LoanManagement"
        component={LoanManagementScreen}
        options={{
          tabBarLabel: 'Ödünç İşlemleri',
          tabBarIcon: ({focused}) => (
            <Image
              source={loan_management}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#121921' : '#999999',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default LibrarianNavigator;
