import React, {useEffect} from 'react';
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
import {fetchBooks} from '../../redux/features/userBookSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {books, isLoading, error} = useSelector(
    (state: RootState) => state.userBooks,
  );

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    dispatch(fetchBooks());
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C4CBE" />
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

  const availableBooks = books.filter(book => book.status === 'available');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>KÜTÜPHANE</Text>
        <TouchableOpacity>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.conteiner_2}>
        <View style={styles.statsContainer}>
          

          <View style={styles.statsButtons}>
            <TouchableOpacity style={styles.statsButton}>
              <Text style={styles.statsButtonText}>Müsait Kitaplar</Text>
              <Text style={styles.statsButtonCount}>
                {availableBooks.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statsButton, styles.statsButtonGray]}>
              <Text style={styles.statsButtonText}>Tüm Kitaplar</Text>
              <Text style={styles.statsButtonCount}>{books.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statsButton, styles.statsButtonGray]}>
              <Text style={styles.statsButtonText}>Ödünç Alınan</Text>
              <Text style={styles.statsButtonCount}>
                {books.filter(book => book.status === 'borrowed').length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bookList}>
          {books.map((book, index) => (
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
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.bookDetails}>
                  <Text style={styles.detailText}>ISBN: {book.ISBN}</Text>
                  <Text style={styles.detailText}>
                    Yayın Yılı: {book.publishYear}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={[styles.statusText, styles[book.status]]}>
                    {book.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C4CBE',
  },
  conteiner_2: {
    backgroundColor: 'white',
    marginTop: windowHeight * 0.05,
    borderTopLeftRadius: windowWidth * 0.07,
    borderTopRightRadius: windowWidth * 0.07,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 20,
    marginLeft: windowWidth * 0.2,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '800',
  },
  notificationIcon: {
    fontSize: 24,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  statsHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C4CBE',
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
  bookItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
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
    backgroundColor: '#2C4CBE',
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
});

export default HomeScreen;
