import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Book} from '../../types/book';
import BookQRModal from './BookQRModal';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

const BookList = ({books, onEdit, onDelete}: BookListProps) => {
  const {isLoading} = useSelector((state: RootState) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#121921" />
      </View>
    );
  }

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    setIsQRModalVisible(true);
  };

  const renderItem = ({item}: {item: Book}) => {
    // Kitap durumunu belirle
    let displayStatus: 'available' | 'borrowed' | 'reserved' =
      item.quantity === 0 ? 'borrowed' : item.status;

    const getStatusText = (status: 'available' | 'borrowed' | 'reserved') => {
      if (status === 'borrowed') return 'Ödünç Alındı';
      if (status === 'available') return 'Mevcut';
      return 'Rezerve Edildi';
    };

    return (
      <TouchableOpacity onPress={() => handleBookPress(item)}>
        <View style={styles.bookItem}>
          {item.imageUrl && (
            <Image source={{uri: item.imageUrl}} style={styles.bookImage} />
          )}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>Yazar: {item.author}</Text>
            <Text style={styles.bookDetails}>ISBN: {item.ISBN}</Text>
            <Text style={styles.bookDetails}>
              Yayın Yılı: {item.publishYear}
            </Text>
            <Text style={styles.bookDetails}>Kategori: {item.category}</Text>
            <Text style={styles.bookDetails}>Adet: {item.quantity}</Text>
            <Text
              style={[
                styles.bookStatus,
                displayStatus === 'borrowed' && styles.borrowedStatus,
                displayStatus === 'reserved' && styles.reservedStatus,
                displayStatus === 'available' && styles.availableStatus,
              ]}>
              Durum: {getStatusText(displayStatus)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(item)}>
              <Text style={styles.buttonText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(item._id)}>
              <Text style={styles.buttonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz kitap eklenmemiş</Text>
        }
      />
      <BookQRModal
        visible={isQRModalVisible}
        onClose={() => {
          setIsQRModalVisible(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  bookItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  bookStatus: {
    fontSize: 14,
    color: '#121921',
    fontWeight: '500',
  },
  actionButtons: {
    justifyContent: 'space-around',
    width: 80,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#121921',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  borrowedStatus: {
    color: '#FF4444',
  },
  reservedStatus: {
    color: '#FFA500',
  },
  availableStatus: {
    color: '#4CAF50',
  },
});

export default BookList;
