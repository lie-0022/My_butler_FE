import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import type { UserProfileResponse } from '@/types/user';

export default function HomeScreen() {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getMyProfile();
        setProfile(res.data);
        setUser(res.data);
      } catch {
        // 오류 처리
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요,</Text>
          <Text style={styles.username}>{profile?.name ?? profile?.username ?? '버틀러'}님 👋</Text>
        </View>
      </View>

      {/* 버틀러 카드 */}
      <View style={styles.butlerCard}>
        <Text style={styles.butlerTitle}>나만의 버틀러</Text>
        <Text style={styles.butlerDesc}>
          오늘 어떤 도움이 필요하신가요?{'\n'}버틀러에게 물어보세요.
        </Text>
        <TouchableOpacity style={styles.butlerBtn}>
          <Text style={styles.butlerBtnText}>버틀러와 대화하기</Text>
        </TouchableOpacity>
      </View>

      {/* 추천 섹션 */}
      <Text style={styles.sectionTitle}>오늘의 추천</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>아직 준비 중이에요 ✨</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inner: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  username: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginTop: 2 },
  butlerCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  butlerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  butlerDesc: { fontSize: 14, color: Colors.white + 'CC', lineHeight: 20, marginBottom: 20 },
  butlerBtn: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  butlerBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  emptyBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
