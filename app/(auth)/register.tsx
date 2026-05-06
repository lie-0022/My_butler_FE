import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '@/api/auth';
import { Colors } from '@/constants/colors';
import { parseApiError } from '@/utils/parseApiError';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const checkUsername = async () => {
    if (!username.trim()) return;
    try {
      const res = await authApi.checkUsername(username);
      setUsernameAvailable(res.data.available);
    } catch {
      Alert.alert('오류', '아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (usernameAvailable === false) {
      Alert.alert('입력 오류', '이미 사용 중인 아이디입니다.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      // 온보딩 Step 2로 이동
      router.replace('/(onboarding)/step2');
    } catch (error) {
      Alert.alert('회원가입 실패', parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>회원가입</Text>

        {/* 아이디 */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="아이디"
            value={username}
            onChangeText={(v) => {
              setUsername(v);
              setUsernameAvailable(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.checkBtn} onPress={checkUsername}>
            <Text style={styles.checkBtnText}>중복확인</Text>
          </TouchableOpacity>
        </View>
        {usernameAvailable === true && (
          <Text style={styles.available}>사용 가능한 아이디입니다.</Text>
        )}
        {usernameAvailable === false && (
          <Text style={styles.unavailable}>이미 사용 중인 아이디입니다.</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? '가입 중...' : '가입하기'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.link}>← 로그인으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  checkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  checkBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  available: {
    color: Colors.success,
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  unavailable: {
    color: Colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
  },
});
