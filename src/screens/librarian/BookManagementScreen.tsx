import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchBooks, deleteBook} from '../../redux/features/bookSlice';
import BookList from '../../components/books/BookList';
import BookFormModal from '../../components/books/BookFormModal';
import {Book} from '../../types/book';
import {leftarrow, plus, qrscan, search} from '../../assets/icons';
import QRScanner from '../../components/scanner/QRScanner';

const BookManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {books} = useSelector((state: RootState) => state.books);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [books, searchQuery]);

  const loadBooks = () => {
    dispatch(fetchBooks());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredBooks =
        books?.filter(
          book =>
            book.title?.toLowerCase().includes(query.toLowerCase()) ||
            book.author?.toLowerCase().includes(query.toLowerCase()) ||
            book.ISBN?.toLowerCase().includes(query.toLowerCase()),
        ) || [];
      setSearchResults(filteredBooks);
    } else {
      setSearchResults(books || []);
    }
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
    loadBooks();
  };

  const handleQRCodeScanned = async (data: string) => {
    try {
      const bookData = JSON.parse(data);
      if (bookData.id) {
        // QR kod ile kitap bulma işlemi
        setSearchQuery(bookData.id);
      }
    } catch (error) {
      Alert.alert('Hata', 'Geçersiz QR kod');
    } finally {
      setIsScannerVisible(false);
    }
  };

  const categories = [
    {id: 'all', label: 'Tümü'},
    {id: 'novel', label: 'Roman'},
    {id: 'science', label: 'Bilim'},
    {id: 'history', label: 'Tarih'},
    {id: 'philosophy', label: 'Felsefe'},
  ];

  return (
    <View style={styles.container}>
      {!isScannerVisible ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Kitap Yönetimi</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Image source={search} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Kitap adı, yazar veya ISBN ara..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor="#666"
                />
              </View>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setIsScannerVisible(true)}>
                <Image source={qrscan} style={styles.scanIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    filterCategory === category.id &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => setFilterCategory(category.id)}>
                  <Text
                    style={[
                      styles.categoryText,
                      filterCategory === category.id &&
                        styles.categoryTextActive,
                    ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <BookList
            books={searchQuery.trim() ? searchResults : books}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsModalVisible(true)}>
            <Image source={plus} style={styles.fabIcon} />
          </TouchableOpacity>

          <BookFormModal
            visible={isModalVisible}
            onClose={handleModalClose}
            editingBook={editingBook}
          />
        </>
      ) : (
        <QRScanner
          onQRCodeScanned={handleQRCodeScanned}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#121921',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#A28D4F',
    padding: 10,
    borderRadius: 12,
  },
  scanIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff17',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#A28D4F',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
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
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default BookManagementScreen;
