import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, sendEmail, getOTPEmailTemplate } from '../_email';

// In-memory storage for demo (use database in production)
if (!global.otpStore) {
  global.otpStore = new Map();
}

if (!global.usersStore) {
  global.usersStore = new Map();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(global.usersStore?.values() || []).find(
      (u: any) => u.email === email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in instead.' },
        { status: 409 }
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
      name,
      type: 'register',
    });

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(otp);
    const emailSent = await sendEmail({
      to: email,
      ...emailTemplate,
    });

    // Log for demo purposes
    console.log(`📧 Registration OTP for ${email}: ${otp} | Email sent: ${emailSent}`);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Check your email for the verification code.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
