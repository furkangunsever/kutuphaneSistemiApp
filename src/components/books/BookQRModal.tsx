import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Book} from '../../types/book';
import {encodeQRData} from '../../utils/qrUtils';

interface BookQRModalProps {
  visible: boolean;
  onClose: () => void;
  book: Book | null;
}

const BookQRModal = ({visible, onClose, book}: BookQRModalProps) => {
  if (!book) return null;

  // QR kod için kitap bilgilerini hazırla
  const bookData = encodeQRData({
    id: book._id,
    title: book.title,
    author: book.author,
    ISBN: book.ISBN,
    publishYear: book.publishYear,
    category: book.category,
    status: book.status,
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{book.title}</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={bookData}
              size={200}
              backgroundColor="white"
              color="black"
              quietZone={10}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Yazar: {book.author}</Text>
            <Text style={styles.detailText}>ISBN: {book.ISBN}</Text>
            <Text style={styles.detailText}>
              Yayın Yılı: {book.publishYear}
            </Text>
            <Text style={styles.detailText}>Kategori: {book.category}</Text>
            <Text style={styles.detailText}>Durum: {book.status}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#121921',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookQRModal;
