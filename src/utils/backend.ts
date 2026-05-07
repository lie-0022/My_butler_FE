/**
 * 백엔드 API 연결 토글.
 *
 * UI 작업 단계 동안은 false. 모든 화면이 완성되고 작업 18(백엔드 연동)에 진입할 때
 * true로 변경하면 모든 폼의 axios 호출이 활성화된다.
 *
 * 폼 onSubmit 패턴:
 *   if (!BACKEND_ENABLED) {
 *     router.push('/(...)/...');
 *     return;
 *   }
 *   // 기존 axios 호출은 try/catch 블록 안에 그대로 보존
 *
 * CLAUDE.md §3 참조.
 */
export const BACKEND_ENABLED = false;
