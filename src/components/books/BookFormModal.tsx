import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {addBook, updateBook} from '../../redux/features/bookSlice';
import {Book} from '../../types/book';

interface BookFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingBook?: Book;
}

const BookFormModal = ({visible, onClose, editingBook}: BookFormModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.books.isLoading);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    publishYear: '',
    quantity: '1',
    status: 'available' as 'available' | 'borrowed' | 'reserved',
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        ISBN: editingBook.ISBN,
        publishYear: editingBook.publishYear.toString(),
        quantity: editingBook.quantity.toString(),
        status: editingBook.status,
      });
    }
  }, [editingBook]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Hata', 'Kitap adı boş olamaz');
      return;
    }
    if (!formData.author.trim()) {
      Alert.alert('Hata', 'Yazar adı boş olamaz');
      return;
    }
    if (!formData.ISBN.trim()) {
      Alert.alert('Hata', 'ISBN numarası boş olamaz');
      return;
    }
    if (!formData.publishYear.trim()) {
      Alert.alert('Hata', 'Yayın yılı boş olamaz');
      return;
    }

    const cleanISBN = formData.ISBN.replace(/[-\s]/g, '');

    try {
      if (editingBook) {
        await dispatch(
          updateBook({
            id: editingBook._id,
            bookData: {
              ...formData,
              ISBN: cleanISBN,
              publishYear: parseInt(formData.publishYear),
              quantity: parseInt(formData.quantity),
            },
          }),
        ).unwrap();
        Alert.alert('Başarılı', 'Kitap başarıyla güncellendi');
      } else {
        await dispatch(
          addBook({
            ...formData,
            ISBN: cleanISBN,
            publishYear: parseInt(formData.publishYear),
            quantity: parseInt(formData.quantity),
          }),
        ).unwrap();
        Alert.alert('Başarılı', 'Kitap başarıyla eklendi');
      }
      onClose();
      resetForm();
    } catch (error: any) {
      const errorMessage =
        typeof error === 'string' ? error : 'Bir hata oluştu';
      Alert.alert('Hata', errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      ISBN: '',
      publishYear: '',
      quantity: '1',
      status: 'available',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kitap Adı *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={text => setFormData({...formData, title: text})}
                placeholder="Kitap adını giriniz"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yazar *</Text>
              <TextInput
                style={styles.input}
                value={formData.author}
                onChangeText={text => setFormData({...formData, author: text})}
                placeholder="Yazar adını giriniz"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>ISBN *</Text>
              <TextInput
                style={styles.input}
                value={formData.ISBN}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^0-9-]/g, '');
                  setFormData({...formData, ISBN: cleanedText});
                }}
                placeholder="ISBN numarasını giriniz"
                keyboardType="numeric"
                maxLength={17}
                editable={!editingBook}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yayın Yılı *</Text>
              <TextInput
                style={styles.input}
                value={formData.publishYear}
                onChangeText={text =>
                  setFormData({...formData, publishYear: text})
                }
                placeholder="Yayın yılını giriniz"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Adet</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={text =>
                  setFormData({...formData, quantity: text})
                }
                placeholder="Kitap adedini giriniz"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  onClose();
                  resetForm();
                }}>
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {editingBook ? 'Güncelle' : 'Ekle'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  submitButton: {
    backgroundColor: '#2C4CBE',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookFormModal; 