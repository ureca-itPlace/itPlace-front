// JWT 토큰 관련 유틸리티 함수

interface JWTPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * 쿠키에서 JWT 토큰을 가져옵니다.
 */
export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access') {
      return value;
    }
  }
  return null;
};

/**
 * 현재 사용자의 role을 확인합니다.
 */
export const getUserRole = (): string | null => {
  const token = getTokenFromCookie();
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.role || null;
};

/**
 * 관리자 권한이 있는지 확인합니다.
 */
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'ROLE_ADMIN';
};

/**
 * 토큰이 만료되었는지 확인합니다.
 */
export const isTokenExpired = (): boolean => {
  const token = getTokenFromCookie();
  if (!token) return true;

  const payload = decodeJWT(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * 유효한 관리자 토큰인지 확인합니다.
 */
export const isValidAdmin = (): boolean => {
  return !isTokenExpired() && isAdmin();
};
