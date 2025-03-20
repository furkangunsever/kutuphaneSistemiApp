import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/user/HomeScreen';
import SearchScreen from '../screens/user/SearchScreen';
import BorrowedBooksScreen from '../screens/user/BorrowedBooksScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import {Image, View} from 'react-native';
import {home, search, books, user} from '../assets/icons';

const Tab = createBottomTabNavigator();

const UserNavigator = () => {
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
