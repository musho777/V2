'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ErrorMessage as FormikErrorMessage, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Input } from '@/components/Input';
import { AuthLayout } from '@/components/layouts';
import { Typography } from '@/components/Typography';
import { useAuth } from '@/hooks/useAuth';

import type { LoginFormValues } from './schema';
import { loginSchema } from './schema';

import styles from './styles.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoginLoading, loginError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const initialValues: LoginFormValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        response: (error as { response?: { data?: unknown } })?.response?.data,
      });
    }
  };

  return (
    <AuthLayout authBottomText="By signing up to create an account I accept Company's Terms of use & Privacy Policy.">
      <div className={styles.loginForm}>
        <Typography variant="heading1" className={styles.loginTitle}>
          Sign In
        </Typography>
        <Typography variant="body2" className={styles.loginSubtitle}>
          Enter your Email address and password to log in to your CRM system.
          After successful login, you will be redirected to your dashboard.
        </Typography>

        <ErrorMessage
          message={
            loginError
              ? loginError instanceof Error
                ? loginError.message
                : 'Login failed. Please try again.'
              : null
          }
        />

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <Input
                  label="Email address"
                  name="username"
                  type="text"
                  placeholder="Enter your email address"
                  value={values.username || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={
                    errors.username && touched.username ? 'error' : undefined
                  }
                  width="100%"
                />
                <FormikErrorMessage
                  name="username"
                  component="span"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={values.password || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={
                    errors.password && touched.password ? 'error' : undefined
                  }
                  width="100%"
                />
                <FormikErrorMessage
                  name="password"
                  component="span"
                  className={styles.errorText}
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isLoginLoading}
                block
                size="large"
              >
                {isLoginLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <Link
          href="/forgot-password"
          className={styles.forgotPassword}
          onClick={(e) => {
            e.preventDefault();
            router.push('/forgot-password');
          }}
        >
          Forgot Password?
        </Link>
      </div>
    </AuthLayout>
  );
}
