import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
          setLoggingOut(false);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 프로필 헤더 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] ?? user?.username?.[0] ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? '-'}</Text>
        <Text style={styles.username}>@{user?.username ?? '-'}</Text>
        <Text style={styles.email}>{user?.email ?? '-'}</Text>
      </View>

      {/* 메뉴 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>내 정보 수정</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>취향 설정</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>알림 설정</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={styles.logoutText}>{loggingOut ? '로그아웃 중...' : '로그아웃'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
  profileHeader: { alignItems: 'center', marginBottom: 36 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, color: Colors.white, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  username: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  email: { fontSize: 13, color: Colors.textSecondary },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: { fontSize: 15, color: Colors.text },
  menuArrow: { fontSize: 20, color: Colors.textSecondary },
  logoutBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  logoutBtnDisabled: { opacity: 0.6 },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});
