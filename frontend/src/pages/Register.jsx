import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';

const Register = () => {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    const result = await registerUser({
      name: data.name, email: data.email,
      password: data.password, targetRole: data.targetRole,
      experienceLevel: data.experienceLevel,
    });
    if (result.success) {
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-slate-400 text-sm">Start your AI-powered interview prep</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="Alex Ryder"
          icon={<User size={15} />}
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', { required: 'Password required', minLength: { value: 8, message: 'At least 8 characters' } })}
        />
        <Input
          label="Target Role (optional)"
          placeholder="e.g. Senior Software Engineer"
          icon={<Briefcase size={15} />}
          {...register('targetRole')}
        />

        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">Experience Level</label>
          <select
            className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-accent focus:ring-1 focus:ring-accent/25 transition-all"
            {...register('experienceLevel')}
          >
            <option value="entry">Entry Level (&lt; 2 years)</option>
            <option value="mid" selected>Mid Level (2-5 years)</option>
            <option value="senior">Senior (5+ years)</option>
            <option value="lead">Lead / Principal</option>
          </select>
        </div>

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:text-accent-2 font-medium transition-colors">
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-slate-300">
        By signing up you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Register;
