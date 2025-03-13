import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {qrscan} from '../../assets/icons';
import QRScanner from '../../components/scanner/QRScanner';
import {
  lendBook,
  setSelectedUser,
  setSelectedBook,
  clearSelection,
  findUserByEmail,
} from '../../redux/features/loanManagementSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

const LoanManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {selectedUser, selectedBook, isLoading} = useSelector(
    (state: RootState) => state.loanManagement,
  );
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [scanningFor, setScanningFor] = useState<'user' | 'book' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  ); // 14 gün sonrası

  const handleQRCodeScanned = async (data: string) => {
    try {
      console.log('Scanned QR Data:', data);
      const scannedData = JSON.parse(data);
      console.log('Parsed QR Data:', scannedData);

      if (scanningFor === 'user') {
        // Kullanıcı QR kodu
        if (scannedData.email && scannedData.name) {
          try {
            // Email ile kullanıcıyı bul
            const userData = await dispatch(findUserByEmail(scannedData.email)).unwrap();
            
            dispatch(
              setSelectedUser({
                _id: userData._id, // MongoDB ObjectId
                name: userData.name,
              }),
            );
            Alert.alert('Başarılı', `${userData.name} seçildi`);
          } catch (error: any) {
            Alert.alert('Hata', error.message || 'Kullanıcı bulunamadı');
          }
        } else {
          Alert.alert('Hata', 'Geçersiz kullanıcı QR kodu');
        }
      } else if (scanningFor === 'book') {
        // Kitap QR kodu
        console.log('Kitap verisi:', scannedData); // Debug için
        if (
          scannedData.id &&
          scannedData.title &&
          scannedData.status === 'available'
        ) {
          dispatch(
            setSelectedBook({
              _id: scannedData.id,
              title: scannedData.title,
              author: scannedData.author,
            }),
          );
          Alert.alert('Başarılı', `${scannedData.title} seçildi`);
        } else if (scannedData.status !== 'available') {
          Alert.alert('Hata', 'Bu kitap şu anda ödünç verilemez');
        } else {
          Alert.alert('Hata', 'Geçersiz kitap QR kodu');
        }
      }
    } catch (error) {
      console.error('QR Code Error:', error);
      Alert.alert(
        'Hata',
        'QR kod okunamadı. Lütfen geçerli bir QR kod okuttuğunuzdan emin olun.',
      );
    } finally {
      setIsScannerVisible(false);
      setScanningFor(null);
    }
  };

  const startScanning = (type: 'user' | 'book') => {
    setScanningFor(type);
    setIsScannerVisible(true);
  };

  const handleLendBook = async () => {
    if (!selectedUser || !selectedBook) {
      Alert.alert('Hata', 'Lütfen kullanıcı ve kitap seçin');
      return;
    }

    try {
      await dispatch(
        lendBook({
          userId: selectedUser._id,
          bookId: selectedBook._id,
          dueDate: dueDate.toISOString(),
        }),
      ).unwrap();
      Alert.alert('Başarılı', 'Kitap başarıyla ödünç verildi');
      dispatch(clearSelection());
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      {!isScannerVisible ? (
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Ödünç İşlemleri</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Kullanıcı Seç</Text>
            {selectedUser ? (
              <View style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>
                  Kullanıcı: {selectedUser.name}
                </Text>
                <TouchableOpacity
                  onPress={() => dispatch(setSelectedUser(null))}
                  style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Temizle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => startScanning('user')}>
                <Image source={qrscan} style={styles.scanIcon} />
                <Text style={styles.scanButtonText}>Kullanıcı QR Okut</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Kitap Seç</Text>
            {selectedBook ? (
              <View style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>
                  Kitap: {selectedBook.title}
                </Text>
                <TouchableOpacity
                  onPress={() => dispatch(setSelectedBook(null))}
                  style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Temizle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => startScanning('book')}>
                <Image source={qrscan} style={styles.scanIcon} />
                <Text style={styles.scanButtonText}>Kitap QR Okut</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. İade Tarihi Seç</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>
                {dueDate.toLocaleDateString('tr-TR')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.lendButton,
              (!selectedUser || !selectedBook) && styles.lendButtonDisabled,
            ]}
            onPress={handleLendBook}
            disabled={!selectedUser || !selectedBook || isLoading}>
            <Text style={styles.lendButtonText}>
              {isLoading ? 'İşleniyor...' : 'Ödünç Ver'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}
        </ScrollView>
      ) : (
        <QRScanner
          onQRCodeScanned={handleQRCodeScanned}
          onClose={() => {
            setIsScannerVisible(false);
            setScanningFor(null);
          }}
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
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121921',
    marginBottom: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scanIcon: {
    width: 24,
    height: 24,
    tintColor: '#121921',
    marginRight: 10,
  },
  scanButtonText: {
    color: '#121921',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedItemText: {
    fontSize: 16,
    color: '#121921',
  },
  clearButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#121921',
  },
  lendButton: {
    backgroundColor: '#A28D4F',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  lendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  lendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoanManagementScreen;
