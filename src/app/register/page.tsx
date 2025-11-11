'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ErrorMessage as FormikErrorMessage, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Input } from '@/components/Input';
import { AuthLayout } from '@/components/layouts';
import { Typography } from '@/components/Typography';
import { useAuth } from '@/hooks/useAuth';

import type { RegisterFormValues } from './schema';
import { registerSchema } from './schema';

import styles from './styles.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (_values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement registration API call
      // await registerService(values);

      router.push('/login');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout authBottomText="By signing up to create an account I accept Company's Terms of use & Privacy Policy.">
      <div className={styles.registerForm}>
        <Typography variant="heading1" className={styles.registerTitle}>
          Welcome to [CRM Name]
        </Typography>
        <Typography variant="body2" className={styles.registerSubtitle}>
          To continue setting up your account, please log in using the temporary
          password that was sent to your email. You'll be asked to create a new
          password after logging in.
        </Typography>

        <ErrorMessage message={error} />

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(registerSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="The email that received the invitation"
                  value={values.email || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.email && touched.email ? 'error' : undefined}
                  width="100%"
                />
                <FormikErrorMessage
                  name="email"
                  component="span"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="The temporary password provided in the email"
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
                loading={isLoading}
                block
                size="large"
                style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: 'rgba(255, 255, 255, 1)',
                }}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <Typography
                as="span"
                variant="body2"
                onClick={() => router.push('/login')}
                className={styles.backToLogin}
              >
                Already have an account?{' '}
                <Typography
                  as="span"
                  variant="body2"
                  style={{ textDecoration: 'underline' }}
                >
                  Sign In
                </Typography>
              </Typography>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}
