import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, CTA } from '@/components/ui';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';
import type { ScanResultResponse } from '@/types/inventory';

/** BACKEND_ENABLED=false일 때 화면 흐름만 검증하기 위한 mock 결과. */
const MOCK_SCAN: ScanResultResponse = {
  name: 'Lagavulin 16',
  category: 'WHISKEY',
  abv: 43,
  capacityMl: 700,
  confidence: 0.82,
  rawText: 'LAGAVULIN AGED 16 YEARS 43% vol 700ml',
};

export default function BottleScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  /** 촬영된 결과를 bottle/new로 넘기며 폼 prefill (router params). */
  const goToFormWith = (result: ScanResultResponse) => {
    router.replace({
      pathname: '/bottle/new',
      params: {
        scanName: result.name ?? '',
        scanCategory: result.category ?? '',
        scanAbv: result.abv != null ? String(result.abv) : '',
        scanCapacityMl: result.capacityMl != null ? String(result.capacityMl) : '',
        scanConfidence: result.confidence != null ? String(result.confidence) : '',
      },
    });
  };

  const capture = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      // 1) 촬영 (BACKEND_ENABLED=false면 mock으로 흐름만 검증)
      if (!BACKEND_ENABLED) {
        goToFormWith(MOCK_SCAN);
        return;
      }

      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        // 셔터 소리 끄기 (Android는 동작, iOS는 OS 정책상 일부 지역 강제음).
        shutterSound: false,
      });
      if (!photo?.uri) throw new Error('촬영에 실패했습니다.');

      // 2) 리사이즈/압축 (업로드 용량 절감 — 가로 1280px 제한)
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1280 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      // 3) OCR 스캔 호출
      const res = await inventoryApi.scan(manipulated.uri);
      goToFormWith(res.data);
    } catch (err) {
      Alert.alert(
        '스캔 실패',
        `${parseApiError(err).message}\n수동 입력으로 진행할 수 있어요.`,
        [
          { text: '다시 시도', style: 'cancel' },
          { text: '수동 입력', onPress: () => router.replace('/bottle/new') },
        ],
      );
    } finally {
      setProcessing(false);
    }
  };

  // ─── 권한 처리 ─────────────────────────────────────────────────────────
  if (!permission) {
    // 권한 로딩 중
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber[400]} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]} testID="bottle-scan-screen">
        <StatusBar style="dark" />
        <AppBar left={<BackBtn onPress={() => router.back()} />} title="라벨 스캔" serif={false} />
        <View style={styles.permissionBox}>
          <Text style={styles.permTitle}>카메라 권한이 필요해요</Text>
          <Text style={styles.permSub}>
            술병 라벨을 촬영해서 제품 정보를{'\n'}자동으로 채우기 위해 카메라를 사용해요.
          </Text>
          <View style={styles.permCta}>
            <CTA variant="amber" onPress={requestPermission} testID="bottle-scan-permission-button">
              카메라 권한 허용
            </CTA>
          </View>
          <Pressable onPress={() => router.replace('/bottle/new')}>
            <Text style={styles.manualLink}>수동으로 입력하기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── 카메라 뷰 ─────────────────────────────────────────────────────────
  return (
    <View style={styles.root} testID="bottle-scan-screen">
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        // 셔터 시각 효과(흰 플래시) 비활성화
        animateShutter={false}
        // 비디오 녹화 안 하므로 마이크 권한/오디오 캡처 차단
        mute
      />

      {/* 상단 닫기 */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing[2] }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          testID="bottle-scan-close-button"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.topTitle}>라벨 스캔</Text>
        <View style={styles.closeBtn} />
      </View>

      {/* 가이드 프레임 */}
      <View style={styles.guideWrap} pointerEvents="none">
        <View style={styles.guideFrame} />
        <Text style={styles.guideText}>술병 라벨을 프레임 안에 맞춰주세요</Text>
      </View>

      {/* 하단 촬영 버튼 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing[5] }]}>
        <Pressable onPress={() => router.replace('/bottle/new')}>
          <Text style={styles.manualLinkLight}>수동 입력</Text>
        </Pressable>
        <Pressable
          onPress={capture}
          disabled={processing}
          style={styles.shutter}
          testID="bottle-scan-capture-button"
        >
          {processing ? (
            <ActivityIndicator color={colors.ink[900]} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </Pressable>
        <View style={styles.shutterSpacer} />
      </View>

      {processing ? (
        <View style={styles.processingOverlay} pointerEvents="none">
          <ActivityIndicator color={colors.amber[200]} size="large" />
          <Text style={styles.processingText}>라벨 분석 중...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink[900] },
  center: { alignItems: 'center', justifyContent: 'center' },

  // 권한 화면
  permissionBox: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    backgroundColor: colors.paper[50],
    alignItems: 'center',
  },
  permTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    marginBottom: spacing[3],
  },
  permSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    textAlign: 'center',
    lineHeight: fontSize.md * lineHeight.relaxed,
    marginBottom: spacing[6],
  },
  permCta: { width: '100%', marginBottom: spacing[4] },
  manualLink: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.sm,
    color: colors.amber[600],
    paddingVertical: spacing[2],
  },

  // 카메라 오버레이
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    zIndex: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.paper[50],
    fontSize: fontSize.lg,
  },
  topTitle: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideFrame: {
    width: '70%',
    height: '42%',
    borderWidth: 2,
    borderColor: colors.amber[300],
    borderRadius: radius.lg,
    backgroundColor: 'transparent',
  },
  guideText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[50],
    marginTop: spacing[4],
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[7],
    zIndex: 2,
  },
  manualLinkLight: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.sm,
    color: colors.paper[200],
    width: 64,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.paper[50],
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.paper[50],
  },
  shutterSpacer: { width: 64 },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    zIndex: 3,
  },
  processingText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
});
