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
import {login} from '../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../redux/store';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifre giriniz');
      return;
    }
    if (!userRole) {
      Alert.alert('Hata', 'Lütfen rol seçiniz');
      return;
    }
    dispatch(login({email, password, role: userRole}));
  };

  return (
    <ImageBackground
      source={require('../../assets/images/izmirim_resized.png')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.subtitle}>
            {userRole === 'librarian'
              ? 'Kütüphaneci Girişi'
              : 'Kullanıcı Girişi'}
          </Text>
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
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              Hesabınız yok mu? Kayıt olun
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
  loginButton: {
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
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
