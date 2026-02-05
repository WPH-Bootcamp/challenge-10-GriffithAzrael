'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitEventHandler } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Field, FieldTitle, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useLoginMutation } from '@/features/auth/hooks';

type LoginFormState = {
  email: string;
  password: string;
};

type LoginErrors = Partial<LoginFormState>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});

  const router = useRouter();
  const { login: setAuthUser } = useAuth();

  const loginMutation = useLoginMutation({
    onSuccess: (data, variables) => {
      // cari nama yg pernah disimpan saat register (jika ada)
      let profileName: string | undefined;
      let username: string | undefined;
      let avatarUrl: string | undefined;

      if (typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem('userProfiles');
          if (raw) {
            const profiles = JSON.parse(raw) as Record<
              string,
              { name?: string; username?: string; avatarUrl?: string }
            >;
            const profile = profiles[variables.email];
            if (profile) {
              profileName = profile.name;
              username = profile.username;
              avatarUrl = profile.avatarUrl;
            }
          }
        } catch {
          // abaikan error parsing
        }
      }

      setAuthUser({
        email: variables.email,
        token: data.token,
        name: profileName,
        username,
        avatarUrl,
      });

      router.push('/');
    },
    onError: () => {
      toast.error('Gagal login. User tidak ditemukan.');
    },
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const newErrors: LoginErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email required';
    if (!form.password.trim()) newErrors.password = 'Password required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    loginMutation.mutate({
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white text-neutral-950'>
      <div className='flex w-86.25 flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-[0_0_24px_rgba(205,204,204,0.16)] md:w-90'>
        <FieldTitle className='text-xl font-bold'>Sign In</FieldTitle>

        <form
          onSubmit={handleSubmit}
          noValidate
          className='flex flex-col gap-5'
        >
          {/* Email */}
          <Field className='gap-1'>
            <FieldLabel
              className='text-sm font-semibold text-neutral-900'
              htmlFor='email'
            >
              Email
            </FieldLabel>
            <Input
              id='email'
              type='email'
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`border-neutral-300 ${
                errors.email ? 'border-[#EE1D52]' : ''
              }`}
              placeholder='Enter your email'
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id='email-error' className='mt-1 text-xs text-[#EE1D52]'>
                {errors.email}
              </p>
            )}
          </Field>

          {/* Password */}
          <Field className='gap-1'>
            <FieldLabel
              className='text-sm font-semibold text-neutral-900'
              htmlFor='password'
            >
              Password
            </FieldLabel>

            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className={`border-neutral-300 pr-10 ${
                  errors.password ? 'border-[#EE1D52]' : ''
                }`}
                placeholder='Enter your password'
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
              />

              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-3 flex items-center'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Image
                  src={showPassword ? '/icons/eye.svg' : '/icons/eye-off.svg'}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {errors.password && (
              <p id='password-error' className='mt-1 text-xs text-[#EE1D52]'>
                {errors.password}
              </p>
            )}
          </Field>

          <Button type='submit' disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>

          <p className='text-center text-sm'>
            Don&apos;t have an account?{' '}
            <a className='text-primary-300 font-semibold' href='/register'>
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
