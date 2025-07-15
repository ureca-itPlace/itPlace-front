import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';
import LoginForm from '../components/LoginForm';

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-grey01 gap-[40px]">
      <AuthSideCard />
      <AuthFormCard>
        <LoginForm />
      </AuthFormCard>
      <div className="bg-red-500 text-white p-4 text-body-2">Tailwind 적용 테스트</div>
    </div>
  );
};

export default AuthLayout;
