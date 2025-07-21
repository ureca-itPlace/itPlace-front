import React from 'react';
import { Navigate } from 'react-router-dom';
import { isValidAdmin } from '../utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * 관리자 권한이 있는 사용자만 접근할 수 있는 보호된 라우트
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const hasAdminAccess = isValidAdmin();

  if (!hasAdminAccess) {
    // 관리자 권한이 없으면 메인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
