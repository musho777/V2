'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ErrorMessage as FormikErrorMessage, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Input } from '@/components/Input';
import { AuthLayout } from '@/components/layouts';
import { Typography } from '@/components/Typography';

import type { ForgotPasswordFormValues } from './schema';
import { forgotPasswordSchema } from './schema';

import styles from './styles.module.scss';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initialValues: ForgotPasswordFormValues = {
    email: '',
  };

  const handleSubmit = async (_values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement forgot password API call
      // await forgotPasswordService(values.email);

      setSuccess(true);
    } catch (error) {
      console.error('Forgot password failed:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className={styles.forgotPasswordForm}>
          <Typography variant="heading1" className={styles.title}>
            Check Your Email
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </Typography>
          <Button
            type="primary"
            onClick={() => router.push('/login')}
            block
            size="large"
          >
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout authBottomText="By signing up to create an account I accept Company's Terms of use & Privacy Policy.">
      <div className={styles.forgotPasswordForm}>
        <Typography variant="heading1" className={styles.title}>
          Reset password
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Enter the email address associated with your account, and we&apos;ll
          send you a link to reset your password.
        </Typography>

        <ErrorMessage message={error} />

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(forgotPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
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
                {isLoading ? 'Sending...' : 'Send the link'}
              </Button>

              <Typography
                as="span"
                variant="body2"
                onClick={() => router.push('/login')}
                className={styles.backToLogin}
              >
                or{' '}
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
