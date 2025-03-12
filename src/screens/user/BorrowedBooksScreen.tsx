import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BorrowedBooksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ödünç Alınan Kitaplar</Text>
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
});

export default BorrowedBooksScreen; 