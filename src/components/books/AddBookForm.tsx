import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addBook} from '../../redux/features/bookSlice';
import {AppDispatch, RootState} from '../../redux/store';

const AddBookForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.books.isLoading);
  const error = useSelector((state: RootState) => state.books.error);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    publishYear: '',
    quantity: '1',
    status: 'available' as 'available' | 'borrowed' | 'reserved',
  });

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
      await dispatch(
        addBook({
          ...formData,
          ISBN: cleanISBN,
          publishYear: parseInt(formData.publishYear),
          quantity: parseInt(formData.quantity),
        }),
      ).unwrap();
      Alert.alert('Başarılı', 'Kitap başarıyla eklendi');
      setFormData({
        title: '',
        author: '',
        ISBN: '',
        publishYear: '',
        quantity: '1',
        status: 'available',
      });
    } catch (error: any) {
      const errorMessage = error.includes('duplicate key error')
        ? 'Bu ISBN numarası ile daha önce kitap eklenmiş'
        : error || 'Kitap eklenirken bir hata oluştu';

      Alert.alert('Hata', errorMessage);
      console.log('Kitap ekleme hatası:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yeni Kitap Ekle</Text>

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
          placeholder="ISBN numarasını giriniz (Örn: 978-0-123456-47-2)"
          keyboardType="numeric"
          maxLength={17}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Yayın Yılı *</Text>
        <TextInput
          style={styles.input}
          value={formData.publishYear}
          onChangeText={text => setFormData({...formData, publishYear: text})}
          placeholder="Yayın yılını giriniz"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Adet</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={text => setFormData({...formData, quantity: text})}
          placeholder="Kitap adedini giriniz"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kitap Ekle</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  button: {
    backgroundColor: '#2C4CBE',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#93a0d3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBookForm;
