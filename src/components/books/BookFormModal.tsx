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
  Image,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {addBook, updateBook} from '../../redux/features/bookSlice';
import {Book} from '../../types/book';
import {BASE_URL} from '../../config/base_url';

interface BookFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingBook?: Book;
}

const BookFormModal = ({visible, onClose, editingBook}: BookFormModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.books.isLoading);
  const token = useSelector((state: RootState) => state.auth.token);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    publishYear: '',
    category: '',
    quantity: '1',
    status: 'available' as 'available' | 'borrowed' | 'reserved',
  });

  // Hata durumları için state'ler
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    ISBN: '',
    publishYear: '',
    category: '',
    quantity: '',
  });

  const [selectedImage, setSelectedImage] = useState<{
    uri?: string;
    type: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        ISBN: editingBook.ISBN,
        publishYear: editingBook.publishYear.toString(),
        category: editingBook.category,
        quantity: editingBook.quantity.toString(),
        status: editingBook.status,
      });
    }
  }, [editingBook]);

  // Form validasyonları
  const validateTitle = (text: string) => {
    if (!text.trim()) {
      setErrors(prev => ({...prev, title: 'Kitap adı boş bırakılamaz'}));
      return false;
    }
    if (text.length < 2) {
      setErrors(prev => ({
        ...prev,
        title: 'Kitap adı en az 2 karakter olmalıdır',
      }));
      return false;
    }
    setErrors(prev => ({...prev, title: ''}));
    return true;
  };

  const validateAuthor = (text: string) => {
    if (!text.trim()) {
      setErrors(prev => ({...prev, author: 'Yazar adı boş bırakılamaz'}));
      return false;
    }
    if (text.length < 2) {
      setErrors(prev => ({
        ...prev,
        author: 'Yazar adı en az 2 karakter olmalıdır',
      }));
      return false;
    }
    setErrors(prev => ({...prev, author: ''}));
    return true;
  };

  const validateISBN = (text: string) => {
    const cleanISBN = text.replace(/[-\s]/g, '');
    if (!cleanISBN) {
      setErrors(prev => ({...prev, ISBN: 'ISBN boş bırakılamaz'}));
      return false;
    }
    if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
      setErrors(prev => ({
        ...prev,
        ISBN: 'Geçerli bir ISBN giriniz (10 veya 13 haneli)',
      }));
      return false;
    }
    setErrors(prev => ({...prev, ISBN: ''}));
    return true;
  };

  const validatePublishYear = (text: string) => {
    const year = parseInt(text);
    const currentYear = new Date().getFullYear();

    if (!text.trim()) {
      setErrors(prev => ({...prev, publishYear: 'Yayın yılı boş bırakılamaz'}));
      return false;
    }
    if (isNaN(year) || year < 1000 || year > currentYear) {
      setErrors(prev => ({
        ...prev,
        publishYear: `Yayın yılı 1000 ile ${currentYear} arasında olmalıdır`,
      }));
      return false;
    }
    setErrors(prev => ({...prev, publishYear: ''}));
    return true;
  };

  const validateCategory = (text: string) => {
    if (!text.trim()) {
      setErrors(prev => ({...prev, category: 'Kategori boş bırakılamaz'}));
      return false;
    }
    setErrors(prev => ({...prev, category: ''}));
    return true;
  };

  const validateQuantity = (text: string) => {
    const quantity = parseInt(text);
    if (!text.trim()) {
      setErrors(prev => ({...prev, quantity: 'Adet boş bırakılamaz'}));
      return false;
    }
    if (isNaN(quantity) || quantity < 1) {
      setErrors(prev => ({...prev, quantity: 'Adet en az 1 olmalıdır'}));
      return false;
    }
    setErrors(prev => ({...prev, quantity: ''}));
    return true;
  };

  // Input değişiklik handlerleri
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));

    // Validate the field
    switch (name) {
      case 'title':
        validateTitle(value);
        break;
      case 'author':
        validateAuthor(value);
        break;
      case 'ISBN':
        validateISBN(value);
        break;
      case 'publishYear':
        validatePublishYear(value);
        break;
      case 'category':
        validateCategory(value);
        break;
      case 'quantity':
        validateQuantity(value);
        break;
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'image.jpg',
        });
      }
    } catch (error) {
      console.error('Görsel seçme hatası:', error);
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu');
    }
  };

  const handleSubmit = async () => {
    // Tüm alanları validate et
    const isValidTitle = validateTitle(formData.title);
    const isValidAuthor = validateAuthor(formData.author);
    const isValidISBN = validateISBN(formData.ISBN);
    const isValidPublishYear = validatePublishYear(formData.publishYear);
    const isValidCategory = validateCategory(formData.category);
    const isValidQuantity = validateQuantity(formData.quantity);

    if (
      !isValidTitle ||
      !isValidAuthor ||
      !isValidISBN ||
      !isValidPublishYear ||
      !isValidCategory ||
      !isValidQuantity
    ) {
      Alert.alert('Hata', 'Lütfen tüm alanları doğru şekilde doldurunuz');
      return;
    }

    const cleanISBN = formData.ISBN.replace(/[-\s]/g, '');

    try {
      const formDataToSend = new FormData();
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: cleanISBN,
        publishYear: formData.publishYear,
        category: formData.category,
        quantity: formData.quantity,
        status: formData.status,
      };

      formDataToSend.append('title', bookData.title);
      formDataToSend.append('author', bookData.author);
      formDataToSend.append('isbn', bookData.isbn);
      formDataToSend.append('publishYear', bookData.publishYear);
      formDataToSend.append('category', bookData.category);
      formDataToSend.append('quantity', bookData.quantity);
      formDataToSend.append('status', bookData.status);

      if (selectedImage) {
        formDataToSend.append('image', {
          uri:
            Platform.OS === 'ios'
              ? selectedImage.uri?.replace('file://', '')
              : selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        });
      }

      if (editingBook) {
        await dispatch(
          updateBook({
            id: editingBook._id,
            bookData: {
              ...bookData,
              publishYear: parseInt(bookData.publishYear),
              quantity: parseInt(bookData.quantity),
            },
          }),
        ).unwrap();
        Alert.alert('Başarılı', 'Kitap başarıyla güncellendi');
      } else {
        await dispatch(addBook(formDataToSend)).unwrap();
        Alert.alert('Başarılı', 'Kitap başarıyla eklendi');
      }
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Form gönderme hatası:', error);
      Alert.alert('Hata', error.message || 'Kitap eklenirken bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      ISBN: '',
      publishYear: '',
      category: '',
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
                style={[styles.input, errors.title ? styles.inputError : null]}
                value={formData.title}
                onChangeText={text => handleChange('title', text)}
                placeholder="Kitap adını giriniz"
              />
              {errors.title ? (
                <Text style={styles.errorText}>{errors.title}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yazar *</Text>
              <TextInput
                style={[styles.input, errors.author ? styles.inputError : null]}
                value={formData.author}
                onChangeText={text => handleChange('author', text)}
                placeholder="Yazar adını giriniz"
              />
              {errors.author ? (
                <Text style={styles.errorText}>{errors.author}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>ISBN *</Text>
              <TextInput
                style={[styles.input, errors.ISBN ? styles.inputError : null]}
                value={formData.ISBN}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^0-9-]/g, '');
                  handleChange('ISBN', cleanedText);
                }}
                placeholder="ISBN numarasını giriniz"
                keyboardType="numeric"
                maxLength={17}
                editable={!editingBook}
              />
              {errors.ISBN ? (
                <Text style={styles.errorText}>{errors.ISBN}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yayın Yılı *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.publishYear ? styles.inputError : null,
                ]}
                value={formData.publishYear}
                onChangeText={text => handleChange('publishYear', text)}
                placeholder="Yayın yılını giriniz"
                keyboardType="numeric"
              />
              {errors.publishYear ? (
                <Text style={styles.errorText}>{errors.publishYear}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kategori *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.category ? styles.inputError : null,
                ]}
                value={formData.category}
                onChangeText={text => handleChange('category', text)}
                placeholder="Kategori giriniz"
              />
              {errors.category ? (
                <Text style={styles.errorText}>{errors.category}</Text>
              ) : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Adet</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.quantity ? styles.inputError : null,
                ]}
                value={formData.quantity}
                onChangeText={text => handleChange('quantity', text)}
                placeholder="Kitap adedini giriniz"
                keyboardType="numeric"
              />
              {errors.quantity ? (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              ) : null}
            </View>

            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleImagePick}>
                {selectedImage || editingBook?.imageUrl ? (
                  <Image
                    source={{
                      uri: selectedImage?.uri || editingBook?.imageUrl,
                    }}
                    style={styles.bookImage}
                  />
                ) : (
                  <Text style={styles.imagePickerText}>Kitap Görseli Seç</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#121921',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerButton: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default BookFormModal;
