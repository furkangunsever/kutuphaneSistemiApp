import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {fetchBooks, deleteBook} from '../../redux/features/bookSlice';
import BookList from '../../components/books/BookList';
import BookFormModal from '../../components/books/BookFormModal';
import {Book} from '../../types/book';
import {leftarrow, plus, qrscan} from '../../assets/icons';
import QRScanner from '../../components/scanner/QRScanner';
import {borrowBook} from '../../redux/features/loanSlice';

const LibrarianHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

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

  const handleQRCodeScanned = async (data: string) => {
    try {
      const bookData = JSON.parse(data);
      if (bookData.id) {
        await dispatch(borrowBook(bookData.id)).unwrap();
        Alert.alert('Başarılı', 'Kitap başarıyla ödünç alındı');
        loadBooks();
      }
    } catch (error) {
      Alert.alert('Hata', 'Geçersiz QR kod veya işlem başarısız');
    } finally {
      setIsScannerVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isScannerVisible ? (
        <>
          <BookList onEdit={handleEdit} onDelete={handleDelete} />
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={[styles.fab, styles.scanFab]}
              onPress={() => setIsScannerVisible(true)}>
              <Image source={qrscan} style={styles.fabIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, styles.addFab]}
              onPress={() => setIsModalVisible(true)}>
              <Image source={plus} style={styles.fabIcon} />
            </TouchableOpacity>
          </View>
          <BookFormModal
            visible={isModalVisible}
            onClose={handleModalClose}
            editingBook={editingBook}
          />
        </>
      ) : (
        <View style={styles.scannerContainer}>
          <QRScanner
            onQRCodeScanned={handleQRCodeScanned}
            onClose={() => setIsScannerVisible(false)}
          />
        </View>
      )}
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
    backgroundColor: '#121921',
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
  fabContainer: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    flexDirection: 'row',
  },
  scanFab: {
    backgroundColor: '#E07727FF',
    bottom: 100,
  },
  addFab: {
    backgroundColor: '#121921',
  },
  fabIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
  scannerContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default LibrarianHomeScreen;
