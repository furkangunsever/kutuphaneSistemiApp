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
import {register} from '../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {izmirim_resized_2} from '../../assets/images';
import {view, hide} from '../../assets/icons';

const RegisterScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hata durumları için state'ler
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (text: string) => {
    setName(text);
    if (text.trim() === '') {
      setNameError('Ad Soyad alanı boş bırakılamaz');
    } else if (text.length < 3) {
      setNameError('Ad Soyad en az 3 karakter olmalıdır');
    } else {
      setNameError('');
    }
  };

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
    // Şifre değiştiğinde confirm password'ü de kontrol et
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text.trim() === '') {
      setConfirmPasswordError('Şifre tekrar alanı boş bırakılamaz');
    } else if (text !== password) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = async () => {
    // Tüm alanların dolu olduğunu kontrol et
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz');
      return;
    }

    // Hata var mı kontrol et
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      await dispatch(
        register({
          name,
          email,
          password,
        }),
      ).unwrap();
      Alert.alert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
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
          <Text style={styles.title}>Kayıt Ol</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="Ad Soyad"
              placeholderTextColor="#fff"
              value={name}
              onChangeText={validateName}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

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

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.passwordContainer,
                confirmPasswordError ? styles.inputError : null,
              ]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Şifre Tekrar"
                placeholderTextColor="#fff"
                value={confirmPassword}
                onChangeText={validateConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Image
                  source={showConfirmPassword ? hide : view}
                  style={styles.passwordIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              (isLoading ||
                nameError ||
                emailError ||
                passwordError ||
                confirmPasswordError) &&
                styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={
              isLoading ||
              !!nameError ||
              !!emailError ||
              !!passwordError ||
              !!confirmPasswordError
            }>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            )}
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
  registerButton: {
    backgroundColor: '#A28D4F',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
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
