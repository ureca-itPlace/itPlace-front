import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';
import LoginForm from '../components/LoginForm';

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-grey01 gap-[40px]">
      <AuthFormCard radius="left">
        <LoginForm />
      </AuthFormCard>
      <div className="z-10 translate-x-[-61px]">
        <AuthSideCard />
      </div>
    </div>
  );
};

export default AuthLayout;
