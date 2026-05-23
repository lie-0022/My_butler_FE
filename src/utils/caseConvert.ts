/**
 * camelCase ↔ snake_case 키 변환.
 *
 * 백엔드(Spring Boot Jackson)가 SNAKE_CASE 명명 전략을 쓰기 때문에
 * axios 인터셉터에서 요청 body는 camel→snake, 응답 body는 snake→camel로 변환한다.
 *
 * 변환 대상: 객체의 key만. 값(특히 문자열 값)은 그대로 둔다.
 * 배열은 각 요소 재귀.
 * Date, RegExp, FormData, File, Blob 등 특수 객체는 변환하지 않고 그대로 반환.
 */

const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (val === null || typeof val !== 'object') return false;
  // FormData / Blob / ArrayBuffer / Date 등은 변환 제외.
  if (typeof FormData !== 'undefined' && val instanceof FormData) return false;
  if (typeof Blob !== 'undefined' && val instanceof Blob) return false;
  if (typeof ArrayBuffer !== 'undefined' && val instanceof ArrayBuffer) return false;
  if (val instanceof Date) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
};

const camelToSnake = (key: string): string =>
  key.replace(/([A-Z])/g, (_m, c: string) => `_${c.toLowerCase()}`);

const snakeToCamel = (key: string): string =>
  key.replace(/_([a-zA-Z0-9])/g, (_m, c: string) => c.toUpperCase());

export const keysToSnake = (input: unknown): unknown => {
  if (Array.isArray(input)) return input.map(keysToSnake);
  if (!isPlainObject(input)) return input;
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [camelToSnake(k), keysToSnake(v)]),
  );
};

export const keysToCamel = (input: unknown): unknown => {
  if (Array.isArray(input)) return input.map(keysToCamel);
  if (!isPlainObject(input)) return input;
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [snakeToCamel(k), keysToCamel(v)]),
  );
};
