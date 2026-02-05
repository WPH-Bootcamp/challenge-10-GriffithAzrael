'use client';

import { useState } from 'react';
import type { SubmitEventHandler } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Field, FieldTitle, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisterMutation, useLoginMutation } from '@/features/auth/hooks';
import { useAuth } from '@/components/providers/auth-provider';

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<RegisterFormState>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({});

  const router = useRouter();
  const { login: setAuthUser } = useAuth();

  const loginMutation = useLoginMutation({
    onSuccess: (data, variables) => {
      setAuthUser({
        email: variables.email,
        name: form.name,
        token: data.token,
      });
      router.push('/');
    },
    onError: () => {
      toast.error('Gagal login setelah registrasi.');
    },
  });

  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      // Simpan mapping email -> name di localStorage untuk kebutuhan UI
      if (typeof window !== 'undefined') {
        const key = 'userProfiles';
        try {
          const raw = window.localStorage.getItem(key);
          const profiles = (raw ? JSON.parse(raw) : {}) as Record<
            string,
            { name?: string; username?: string; avatarUrl?: string }
          >;

          profiles[form.email] = {
            name: form.name,
            // kita belum punya username/avatar dari backend, jadi biarkan kosong
          };

          window.localStorage.setItem(key, JSON.stringify(profiles));
        } catch {
          // kalau parsing gagal, reset mapping hanya untuk email ini
          window.localStorage.setItem(
            key,
            JSON.stringify({ [form.email]: { name: form.name } })
          );
        }
      }

      // Setelah register sukses, langsung login dengan email & password yg sama
      loginMutation.mutate({
        email: form.email,
        password: form.password,
      });
    },
    onError: () => {
      toast.error('Gagal registrasi. Cek data Anda.');
    },
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const newErrors: RegisterErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!form.email.trim()) newErrors.email = 'Email required';
    if (!form.password.trim()) newErrors.password = 'Password required';
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password required';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Confirm password does not match password';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    registerMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  const isSubmitting = registerMutation.isPending || loginMutation.isPending;

  return (
    <div className='flex min-h-screen items-center justify-center bg-white text-neutral-950'>
      <div className='flex w-86.25 flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-[0_0_24px_rgba(205,204,204,0.16)] md:w-90'>
        <FieldTitle className='text-xl font-bold'>Sign Up</FieldTitle>

        <form
          onSubmit={handleSubmit}
          noValidate
          className='flex flex-col gap-5'
        >
          {/* Name */}
          <Field className='gap-1'>
            <FieldLabel
              className='text-sm font-semibold text-neutral-900'
              htmlFor='name'
            >
              Name
            </FieldLabel>
            <Input
              id='name'
              type='text'
              required
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`border-neutral-300 ${
                errors.name ? 'border-[#EE1D52]' : ''
              }`}
              placeholder='Enter your name'
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id='name-error' className='mt-1 text-xs text-[#EE1D52]'>
                {errors.name}
              </p>
            )}
          </Field>

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

          {/* Confirm Password */}
          <Field className='gap-1'>
            <FieldLabel
              className='text-sm font-semibold text-neutral-900'
              htmlFor='confirmpassword'
            >
              Confirm Password
            </FieldLabel>

            <div className='relative'>
              <Input
                id='confirmpassword'
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className={`border-neutral-300 pr-10 ${
                  errors.confirmPassword ? 'border-[#EE1D52]' : ''
                }`}
                placeholder='Enter your confirm password'
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? 'confirmpassword-error' : undefined
                }
              />

              <button
                type='button'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className='absolute inset-y-0 right-3 flex items-center'
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                <Image
                  src={
                    showConfirmPassword
                      ? '/icons/eye.svg'
                      : '/icons/eye-off.svg'
                  }
                  alt={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {errors.confirmPassword && (
              <p
                id='confirmpassword-error'
                className='mt-1 text-xs text-[#EE1D52]'
              >
                {errors.confirmPassword}
              </p>
            )}
          </Field>

          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>

          <p className='text-center text-sm'>
            Already have an account?{' '}
            <a className='text-primary-300 font-semibold' href='/login'>
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
