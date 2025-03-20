import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {izmirim_resized_2} from '../../assets/images';
import {view, hide} from '../../assets/icons';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text.trim() === '') {
      setEmailError('Email alanı boş bırakılamaz');
    } else if (!/^\S+@\S+\.\S+$/.test(text)) {
      setEmailError('Geçerli bir email adresi giriniz');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (text.trim() === '') {
      setPasswordError('Şifre alanı boş bırakılamaz');
    } else if (text.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    // Giriş yapmadan önce son bir kontrol
    if (email.trim() === '') {
      setEmailError('Email alanı boş bırakılamaz');
      return;
    }
    if (password.trim() === '') {
      setPasswordError('Şifre alanı boş bırakılamaz');
      return;
    }
    if (emailError || passwordError) {
      return;
    }

    try {
      const result = await dispatch(
        login({
          email,
          password,
        }),
      ).unwrap();

      if (result.user.role === 'librarian') {
        navigation.replace('LibrarianTabs');
      } else {
        navigation.replace('UserTabs');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.toString());
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Hata', error);
    }
  }, [error]);

  return (
    <ImageBackground source={izmirim_resized_2} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Giriş Yap</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.passwordContainer,
                passwordError ? styles.inputError : null,
              ]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Şifre"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={showPassword ? hide : view}
                  style={styles.passwordIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (isLoading || emailError || passwordError) &&
                styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading || !!emailError || !!passwordError}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
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
    marginBottom: 30,
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
  },
  passwordToggle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#A28D4F',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
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
