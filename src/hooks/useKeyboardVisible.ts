import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * 키보드 표시 여부를 추적하는 hook.
 *
 * 사용 패턴 — footer/inputBar의 paddingBottom을 동적으로 조정해서
 * 키보드가 떠있을 때 home indicator 영역(insets.bottom)만큼의 빈 공간을 제거한다.
 *
 *   const kbVisible = useKeyboardVisible();
 *   const padBottom = kbVisible ? spacing[3] : insets.bottom + spacing[5];
 *
 * iOS는 will 이벤트(애니메이션 동기화), Android는 did 이벤트(소프트키보드 API 한계).
 */
export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvt, () => setVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return visible;
}
