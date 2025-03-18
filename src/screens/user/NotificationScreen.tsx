import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';

const NotificationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  
  return (
    <View>
      <Text>NotificationScreen</Text>
        <Text style={styles.testButtonText}>Test Bildirimi Gönder</Text>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  testButton: {
    backgroundColor: '#121921',
    padding: 10,
    borderRadius: 8,
    margin: 16,
  },
  testButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
