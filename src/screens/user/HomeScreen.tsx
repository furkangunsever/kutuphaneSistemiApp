import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchBooks} from '../../redux/features/bookSlice';
import BookQRModal from '../../components/books/BookQRModal';
import {notification, qr_code} from '../../assets/icons';
import {Book} from '../../types/book';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HomeScreen = ({navigation}: any) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const {books, isLoading, error} = useSelector(
    (state: RootState) => state.books,
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    dispatch(fetchBooks());
  };

  const handleShowQR = (book: Book) => {
    setSelectedBook(book);
    setIsQRModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#121921" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBooks}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const availableBooks =
    books?.filter(book => book.status === 'available') || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoşgeldin, {user?.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image source={notification} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.conteiner_2}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Kitaplara göz atmaya ne dersin?</Text>
        </View>

        <View style={styles.bookList}>
          {books?.map((book, index) => (
            <View key={book._id} style={styles.bookItem}>
              <Text style={styles.bookIndex}>{index + 1}</Text>
              <View style={styles.bookCover}>
                {book.imageUrl ? (
                  <Image
                    source={{uri: book.imageUrl}}
                    style={styles.coverImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.coverPlaceholder} />
                )}
              </View>
              <View style={styles.bookInfo}>
                <View style={styles.bookTitleContainer}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => handleShowQR(book)}>
                    <Image source={qr_code} style={styles.qrIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.bookDetails}>
                  <Text style={styles.detailText}>ISBN: {book.ISBN}</Text>
                  <Text style={styles.detailText}>
                    Yayın Yılı: {book.publishYear}
                  </Text>
                  <Text style={styles.detailText}>
                    Kategori: {book.category}
                  </Text>
                </View>
                <View style={styles.bookActions}>
                  <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, styles[book.status]]}>
                      {book.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BookQRModal
        visible={isQRModalVisible}
        onClose={() => setIsQRModalVisible(false)}
        book={selectedBook}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121921',
  },
  conteiner_2: {
    backgroundColor: '#fff',
    borderTopLeftRadius: windowWidth * 0.07,
    borderTopRightRadius: windowWidth * 0.07,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '800',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    // margin: 16,
    // elevation: 3,
  },
  statsText: {
    fontSize: 16,
    color: '#A28D4F',
    fontWeight: 'bold',
  },
  statsHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121921',
  },
  statsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statsButton: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsButtonGray: {
    backgroundColor: '#E5E5E5',
  },
  statsButtonText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 4,
  },
  statsButtonCount: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookList: {
    padding: 16,
  },
  bookTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * 0.5,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#A8A8A8FF',
  },
  bookIndex: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
    width: 30,
  },
  bookCover: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  available: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  borrowed: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  reserved: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
  bookDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#121921',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  qrButton: {
    padding: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  qrIcon: {
    width: 24,
    height: 24,
    tintColor: '#121921',
  },
  
});

export default HomeScreen;
