'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MailCheck,
} from 'lucide-react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, signIn, register } = useAuth();
  
  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'signin';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6);
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedCode.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = pastedCode[i];
        }
      }
      
      setOtp(newOtp);
      
      // Focus last filled input or submit if complete
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      
      // Auto-submit if complete
      if (newOtp.every(digit => digit !== '')) {
        handleVerify(newOtp.join(''));
      }
      
      return;
    }

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if complete
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(email, otpCode);

      if (result.success) {
        setSuccess('Verification successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(result.message);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const result = type === 'register' 
        ? await register(email)
        : await signIn(email);

      if (result.success) {
        setSuccess('New code sent! Check your email.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ReleaseGuard AI
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400">
            Enter the 6-digit code sent to
            <br />
            <strong className="text-white">{email}</strong>
          </p>
        </div>

        {/* Verification Card */}
        <Card className="glass border-2 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center">
              <MailCheck className="h-6 w-6 text-blue-500 mr-2" />
              Enter Code
            </CardTitle>
            <CardDescription className="text-center">
              Check your email for the verification code
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-start space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={() => handleVerify()}
                className="w-full"
                size="lg"
                disabled={loading || otp.some(digit => !digit)}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              </div>

              {/* Tips */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">💡 Tips:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Code expires in 10 minutes</li>
                  <li>• You can paste the code directly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/auth/signin" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Use a different email
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
