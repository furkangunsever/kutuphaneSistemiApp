import React from 'react';
import {View, Text, StyleSheet,Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BorrowedBooksScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ödünç Alınan Kitaplar</Text>
      </View>

      <View style={styles.content}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121921',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: windowWidth * 0.07,
    borderTopRightRadius: windowWidth * 0.07,
    paddingTop: 20,
  },
});

export default BorrowedBooksScreen; 