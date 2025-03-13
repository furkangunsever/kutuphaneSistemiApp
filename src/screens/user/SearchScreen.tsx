import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {search as searchIcon} from '../../assets/icons';
import {Book} from '../../types/book';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const {books} = useSelector((state: RootState) => state.books);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Recent searches yüklenirken hata:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query),
      ].slice(0, MAX_RECENT_SEARCHES);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches),
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Recent search kaydedilirken hata:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results =
        books?.filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase()),
        ) || [];
      setSearchResults(results);
      saveRecentSearch(query);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const renderBookItem = ({item}: {item: Book}) => (
    <View style={styles.bookItem}>
      <View style={styles.bookCover}>
        {item.imageUrl ? (
          <Image
            source={{uri: item.imageUrl}}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookDetails}>ISBN: {item.ISBN}</Text>
        <Text style={styles.bookDetails}>Yayın Yılı: {item.publishYear}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, styles[item.status]]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyResult = () => {
    if (!searchQuery) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          "{searchQuery}" ile ilgili sonuç bulunamadı
        </Text>
        <Text style={styles.emptySubText}>
          Farklı bir arama terimi deneyebilirsiniz.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kitap Ara</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Image source={searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kitap adı ara..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
          />
        </View>

        {isSearching ? (
          <ActivityIndicator size="large" color="#121921" />
        ) : searchQuery ? (
          <FlatList
            data={searchResults}
            renderItem={renderBookItem}
            keyExtractor={item => item._id}
            ListEmptyComponent={renderEmptyResult}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Son Aramalar</Text>
            {recentSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleRecentSearchPress(item)}>
                <Image source={searchIcon} style={styles.recentIcon} />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  resultsList: {
    padding: 20,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: 80,
    height: 120,
    marginRight: 15,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  statusContainer: {
    marginTop: 8,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  recentContainer: {
    padding: 20,
  },
  recentTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentIcon: {
    width: 16,
    height: 16,
    tintColor: '#999',
    marginRight: 12,
  },
  recentText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchScreen;
