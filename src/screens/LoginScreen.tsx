import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { authApi } from '../api';
import { persistToken } from '../store/authSlice';
import { theme } from '../theme';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter email/mobile and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      const token =
        response.token ||
        (response as any).accessToken ||
        (response as any).access_token;
      if (token) {
        dispatch(persistToken(token) as any);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(message);
      if (err.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid email/mobile or password.');
      } else if (err.response?.status === 500) {
        Alert.alert('Server Error', 'Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Illustration – person + smartphone from Figma */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../assets/images/login_img.png')}
            style={styles.loginImage}
            resizeMode="contain"
          />
        </View>

        {/* Email or Mobile number */}
        <View style={styles.inputRow}>
          <Icon
            name="mail-outline"
            size={20}
            color={theme.colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email or Mobile number"
            placeholderTextColor={theme.colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputRow}>
          <Icon
            name="lock-closed-outline"
            size={20}
            color={theme.colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    marginHorizontal: 20,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 200,
  },
  loginImage: {
    width: '100%',
    height: 200,
    maxWidth: 320,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 0,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
