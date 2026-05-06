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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { userApi } from '@/api/user';
import { Colors } from '@/constants/colors';
import { parseApiError } from '@/utils/parseApiError';

const GENDERS = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' },
  { label: '기타', value: 'OTHER' },
];

export default function OnboardingStep2Screen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim() || !birthDate.trim() || !gender) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await userApi.updateProfile({ name, birthDate, gender });
      router.replace('/(onboarding)/step3');
    } catch (error) {
      Alert.alert('오류', parseApiError(error).message);
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
        {/* 진행 표시 */}
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, styles.progressDotDone]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>

        <Text style={styles.title}>기본 정보 입력</Text>
        <Text style={styles.subtitle}>버틀러가 나를 더 잘 알 수 있도록 알려주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="생년월일 (예: 1995-03-25)"
          value={birthDate}
          onChangeText={setBirthDate}
          keyboardType="numeric"
        />

        <Text style={styles.label}>성별</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[styles.genderBtn, gender === g.value && styles.genderBtnSelected]}
              onPress={() => setGender(g.value)}
            >
              <Text
                style={[styles.genderBtnText, gender === g.value && styles.genderBtnTextSelected]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? '저장 중...' : '다음'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  progressRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 32 },
  progressDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border,
  },
  progressDotDone: { backgroundColor: Colors.primaryDark },
  progressDotActive: { backgroundColor: Colors.primary },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  label: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
  },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  genderBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  genderBtnText: { fontSize: 15, color: Colors.textSecondary },
  genderBtnTextSelected: { color: Colors.primary, fontWeight: '600' },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
