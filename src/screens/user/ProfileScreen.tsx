import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../redux/features/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    margin: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 