import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { userApi } from '@/api/user';
import { Colors } from '@/constants/colors';

const CATEGORIES = [
  { label: '🍽️ 음식', value: 'FOOD' },
  { label: '✈️ 여행', value: 'TRAVEL' },
  { label: '🎬 영화/드라마', value: 'ENTERTAINMENT' },
  { label: '🏋️ 운동', value: 'FITNESS' },
  { label: '📚 독서', value: 'READING' },
  { label: '🎮 게임', value: 'GAMING' },
  { label: '🎵 음악', value: 'MUSIC' },
  { label: '🛍️ 쇼핑', value: 'SHOPPING' },
];

export default function OnboardingStep3Screen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleComplete = async () => {
    if (selected.length === 0) {
      Alert.alert('선택 오류', '관심 카테고리를 하나 이상 선택해주세요.');
      return;
    }
    setLoading(true);
    try {
      await userApi.savePreferences({ categories: selected });
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '저장에 실패했습니다.';
      Alert.alert('오류', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 진행 표시 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.progressDotDone]} />
        <View style={[styles.progressDot, styles.progressDotDone]} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
      </View>

      <Text style={styles.title}>취향을 알려주세요</Text>
      <Text style={styles.subtitle}>관심 있는 카테고리를 선택해주세요 (복수 선택 가능)</Text>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.chip, selected.includes(cat.value) && styles.chipSelected]}
            onPress={() => toggle(cat.value)}
          >
            <Text
              style={[styles.chipText, selected.includes(cat.value) && styles.chipTextSelected]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? '저장 중...' : '완료'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  progressRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 32 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  progressDotDone: { backgroundColor: Colors.primaryDark },
  progressDotActive: { backgroundColor: Colors.primary },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText: { fontSize: 15, color: Colors.textSecondary },
  chipTextSelected: { color: Colors.primary, fontWeight: '600' },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
