import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  fetchActiveBorrows,
  fetchOverdueBorrows,
  returnBook,
} from '../../redux/features/borrowSlice';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {leftarrow} from '../../assets/icons';

const ReturnBookScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {activeBorrows, overdueBorrows, isLoading, error} = useSelector(
    (state: RootState) => state.borrows,
  );
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [showOverdue, setShowOverdue] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returnCondition, setReturnCondition] = useState<
    'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
  >('good');
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    if (isFocused) {
      loadBorrows();
    }
    // Ekrandan çıkıldığında cleanup işlemi
    return () => {
      setSelectedBorrow(null);
      setReturnModalVisible(false);
    };
  }, [isFocused]);

  const loadBorrows = async () => {
    try {
      await Promise.all([
        dispatch(fetchActiveBorrows()),
        dispatch(fetchOverdueBorrows()),
      ]);
    } catch (error) {
      console.error('Ödünç kayıtları yüklenirken hata:', error);
    }
  };

  const handleReturn = async () => {
    if (!selectedBorrow) return;

    try {
      await dispatch(
        returnBook({
          borrowId: selectedBorrow.id,
          condition: returnCondition,
          notes: returnNotes,
        }),
      ).unwrap();
      Alert.alert('Başarılı', 'Kitap başarıyla iade alındı');
      setReturnModalVisible(false);
      setSelectedBorrow(null);
      loadBorrows();
    } catch (error) {
      Alert.alert('Hata', 'Kitap iade alınırken bir hata oluştu');
    }
  };

  const renderBorrowItem = ({item}: {item: any}) => {
    const isOverdue = new Date(item.dueDate) < new Date();
    return (
      <View style={[styles.borrowItem, isOverdue && styles.overdueItem]}>
        <View style={styles.borrowInfo}>
          <Text style={styles.bookTitle}>{item.bookTitle}</Text>
          <Text style={styles.bookAuthor}>Yazar: {item.bookAuthor}</Text>
          <Text style={styles.borrowDetail}>Ödünç Alan: {item.userName}</Text>
          <Text style={styles.borrowDetail}>
            İade Tarihi: {new Date(item.dueDate).toLocaleDateString('tr-TR')}
          </Text>
          {isOverdue && <Text style={styles.overdueText}>Gecikmiş İade!</Text>}
        </View>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => {
            setSelectedBorrow(item);
            setReturnModalVisible(true);
          }}>
          <Text style={styles.returnButtonText}>İade Al</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // FlatList'in data prop'unu kontrol edelim
  const borrowsToShow = showOverdue ? overdueBorrows : activeBorrows;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#121921" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.filterButton, !showOverdue && styles.activeFilter]}
          onPress={() => setShowOverdue(false)}>
          <Text
            style={[
              styles.filterButtonText,
              !showOverdue && styles.activeFilterText,
            ]}>
            Tüm Ödünçler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showOverdue && styles.activeFilter]}
          onPress={() => setShowOverdue(true)}>
          <Text
            style={[
              styles.filterButtonText,
              showOverdue && styles.activeFilterText,
            ]}>
            Gecikmiş
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={borrowsToShow}
        renderItem={renderBorrowItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {showOverdue
                ? 'Gecikmiş ödünç bulunmamaktadır'
                : 'Aktif ödünç bulunmamaktadır'}
            </Text>
            <Text style={styles.debugText}>
              Debug: {borrowsToShow?.length || 0} kayıt mevcut
            </Text>
          </View>
        }
      />

      <Modal
        visible={returnModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setReturnModalVisible(false);
          setSelectedBorrow(null);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kitap İade</Text>

            <Text style={styles.modalLabel}>Kitap Durumu</Text>
            <View style={styles.conditionButtons}>
              {['excellent', 'good', 'fair', 'poor', 'damaged'].map(
                condition => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionButton,
                      returnCondition === condition &&
                        styles.activeConditionButton,
                    ]}
                    onPress={() =>
                      setReturnCondition(
                        condition as
                          | 'excellent'
                          | 'good'
                          | 'fair'
                          | 'poor'
                          | 'damaged',
                      )
                    }>
                    <Text
                      style={[
                        styles.conditionButtonText,
                        returnCondition === condition &&
                          styles.activeConditionButtonText,
                      ]}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <Text style={styles.modalLabel}>Notlar</Text>
            <TextInput
              style={styles.notesInput}
              value={returnNotes}
              onChangeText={setReturnNotes}
              placeholder="İade ile ilgili notlar..."
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setReturnModalVisible(false);
                  setSelectedBorrow(null);
                }}>
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReturn}>
                <Text style={styles.modalButtonText}>İade Al</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#121921',
  },
  filterButtonText: {
    color: '#121921',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  borrowItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overdueItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  borrowInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121921',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  borrowDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  overdueText: {
    color: '#FF4444',
    fontWeight: 'bold',
    marginTop: 4,
  },
  returnButton: {
    backgroundColor: '#121921',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 12,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  conditionButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 4,
  },
  activeConditionButton: {
    backgroundColor: '#121921',
    borderColor: '#121921',
  },
  conditionButtonText: {
    color: '#666',
  },
  activeConditionButtonText: {
    color: '#fff',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  confirmButton: {
    backgroundColor: '#121921',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#121921',
  },
  activeFilterText: {
    color: '#fff',
  },
  debugText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
});

export default ReturnBookScreen;
