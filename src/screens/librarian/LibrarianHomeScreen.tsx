import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {fetchBooks, deleteBook} from '../../redux/features/bookSlice';
import BookList from '../../components/books/BookList';
import BookFormModal from '../../components/books/BookFormModal';
import {Book} from '../../types/book';
import {leftarrow, plus} from '../../assets/icons';

const LibrarianHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    dispatch(fetchBooks());
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const handleDelete = (bookId: string) => {
    Alert.alert('Kitap Sil', 'Bu kitabı silmek istediğinizden emin misiniz?', [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteBook(bookId)).unwrap();
            Alert.alert('Başarılı', 'Kitap başarıyla silindi');
          } catch (error) {
            Alert.alert(
              'Hata',
              'Kitap silinirken bir hata oluştu. Lütfen tekrar deneyin.',
            );
          }
        },
      },
    ]);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingBook(undefined);
    loadBooks(); // Listeyi yenile
  };

  return (
    <View style={styles.container}>
      <BookList onEdit={handleEdit} onDelete={handleDelete} />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}>
        <Image source={plus} style={styles.plusIcon} />
      </TouchableOpacity>
      <BookFormModal
        visible={isModalVisible}
        onClose={handleModalClose}
        editingBook={editingBook}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2C4CBE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  plusIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
});

export default LibrarianHomeScreen;
