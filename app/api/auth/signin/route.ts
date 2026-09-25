import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, sendEmail, getOTPEmailTemplate } from '../_email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = Array.from(global.usersStore?.values() || []).find(
      (u: any) => u.email === email
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Email not found. Please register first.' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    if (!global.otpStore) {
      global.otpStore = new Map();
    }

    global.otpStore.set(email, {
      otp,
      expiresAt,
      type: 'signin',
    });

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(otp);
    const emailSent = await sendEmail({
      to: email,
      ...emailTemplate,
    });

    // Log for demo purposes
    console.log(`📧 Sign-in OTP for ${email}: ${otp} | Email sent: ${emailSent}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
    });
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Failed to process sign-in' },
      { status: 500 }
    );
  }
}
