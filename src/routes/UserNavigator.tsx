import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/user/HomeScreen';
import SearchScreen from '../screens/user/SearchScreen';
import BorrowedBooksScreen from '../screens/user/BorrowedBooksScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import {Image} from 'react-native';
import {home, search, books, user} from '../assets/icons';

const Tab = createBottomTabNavigator();

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2C4CBE',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({color, size}) => (
            <Image
              source={home}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Arama',
          tabBarIcon: ({color, size}) => (
            <Image
              source={search}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BorrowedBooks"
        component={BorrowedBooksScreen}
        options={{
          title: 'Ödünç Kitaplar',
          tabBarIcon: ({color, size}) => (
            <Image
              source={books}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({color, size}) => (
            <Image
              source={user}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserNavigator;
