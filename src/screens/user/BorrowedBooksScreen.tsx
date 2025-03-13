import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchUserBorrows} from '../../redux/features/userBookSlice';

const windowWidth = Dimensions.get('window').width;

const BorrowedBooksScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {borrows, isLoading, error} = useSelector(
    (state: RootState) => state.userBooks,
  );

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = () => {
    dispatch(fetchUserBorrows());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRemainingDays = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ödünç Alındı';
      case 'returned':
        return 'İade Edildi';
      case 'overdue':
        return 'Süresi Geçti';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#FFA000';
      case 'returned':
        return '#4CAF50';
      case 'overdue':
        return '#FF4444';
      default:
        return '#666';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ödünç Alınan Kitaplar</Text>
        </View>
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#121921" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ödünç Alınan Kitaplar</Text>
        </View>
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBorrows}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ödünç Alınan Kitaplar</Text>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {borrows.length > 0 ? (
            borrows.map(borrow => (
              <View key={borrow.id} style={styles.borrowCard}>
                <View style={styles.bookHeader}>
                  {borrow.bookImage ? (
                    <Image
                      source={{uri: borrow.bookImage}}
                      style={styles.bookImage}
                    />
                  ) : (
                    <View style={styles.bookImagePlaceholder} />
                  )}
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{borrow.bookTitle}</Text>
                    <Text style={styles.bookAuthor}>{borrow.bookAuthor}</Text>
                    <Text style={styles.isbn}>ISBN: {borrow.isbn}</Text>
                  </View>
                </View>

                <View style={styles.borrowDetails}>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Alınma Tarihi:</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(borrow.borrowDate)}
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>İade Tarihi:</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(borrow.dueDate)}
                    </Text>
                  </View>
                  {borrow.returnDate && (
                    <View style={styles.dateRow}>
                      <Text style={styles.dateLabel}>Teslim Tarihi:</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(borrow.returnDate)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.footer}>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getStatusColor(borrow.status)},
                    ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(borrow.status)}
                    </Text>
                  </View>
                  {borrow.status === 'active' && (
                    <Text
                      style={[
                        styles.remainingDays,
                        {color: getStatusColor(borrow.status)},
                      ]}>
                      {getRemainingDays(borrow.dueDate)} gün kaldı
                    </Text>
                  )}
                </View>

                {borrow.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notlar:</Text>
                    <Text style={styles.notesText}>{borrow.notes}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Henüz ödünç aldığınız kitap bulunmuyor.
              </Text>
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borrowCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  bookImagePlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121921',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  isbn: {
    fontSize: 12,
    color: '#999',
  },
  borrowDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
    color: '#121921',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  remainingDays: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#121921',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#A28D4F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BorrowedBooksScreen;
