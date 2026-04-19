import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '@/api/auth';
import { Colors } from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRequest = async () => {
    if (!email.trim()) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await authApi.requestPasswordReset({ email });
      setSent(true);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '요청에 실패했습니다.';
      Alert.alert('오류', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>비밀번호 찾기</Text>

        {sent ? (
          <View style={styles.sentBox}>
            <Text style={styles.sentText}>
              이메일로 비밀번호 재설정 링크를 보냈습니다.{'\n'}메일함을 확인해주세요.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>로그인으로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.desc}>가입한 이메일 주소를 입력하면 재설정 링크를 보내드립니다.</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRequest}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? '전송 중...' : '재설정 링크 전송'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.link}>← 로그인으로</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 16, textAlign: 'center' },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
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
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  backBtn: { marginTop: 20, alignItems: 'center' },
  link: { color: Colors.primary, fontSize: 14 },
  sentBox: { alignItems: 'center', gap: 24 },
  sentText: { fontSize: 15, color: Colors.text, textAlign: 'center', lineHeight: 22 },
});
