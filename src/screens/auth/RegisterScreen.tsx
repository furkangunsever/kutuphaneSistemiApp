import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {izmirim_resized} from '../../assets/images';

const RegisterScreen = ({navigation}: any) => {
  const [name,setName]= useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    if (!userRole) {
      Alert.alert('Hata', 'Lütfen rol seçiniz');
      return;
    }

    try {
      const result = await dispatch(
        register({name, email, password, role: userRole}),
      ).unwrap();
      if (result) {
        Alert.alert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı', [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Hata', error || 'Kayıt işlemi sırasında bir hata oluştu');
    }
  };

  return (
    <ImageBackground source={izmirim_resized} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>
            {userRole === 'librarian' ? 'Kütüphaneci Kaydı' : 'Kullanıcı Kaydı'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="İsim"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre Tekrar"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Zaten hesabınız var mı? Giriş yapın
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  registerButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RegisterScreen;
