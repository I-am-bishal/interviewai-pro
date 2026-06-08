import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';

const Login = () => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const handleDemoLogin = async () => {
    setValue('email', 'demo@interviewai.pro');
    setValue('password', 'demo1234');
    
    toast.loading('Logging in with demo account...', { id: 'demo-login' });
    const result = await login('demo@interviewai.pro', 'demo1234');
    toast.dismiss('demo-login');
    
    if (result.success) {
      toast.success('Welcome back (Demo User)!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold mb-1 tracking-tight">Sign in to your account</h1>
        <p className="text-slate-500 text-sm">Continue your interview prep journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-accent/60 hover:text-accent transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent hover:text-accent-2 font-semibold transition-colors">
          Sign up free
        </Link>
      </div>

      {/* Demo credentials */}
      <div 
        onClick={handleDemoLogin}
        className="mt-6 p-3.5 rounded-xl text-xs text-center transition-all duration-300 group cursor-pointer border"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.04), rgba(59, 130, 246, 0.02))',
          borderColor: 'rgba(124, 91, 240, 0.12)',
        }}
      >
        <span className="text-slate-500">Quick Demo Access:</span>{' '}
        <span className="text-accent group-hover:text-accent-2 font-semibold underline underline-offset-2 transition-colors">
          Click here to log in
        </span>
        <div className="text-[10px] text-slate-400 mt-1 font-mono">
          demo@interviewai.pro / demo1234
        </div>
      </div>
    </div>
  );
};

export default Login;
