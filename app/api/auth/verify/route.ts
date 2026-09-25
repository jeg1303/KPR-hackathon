import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP
    if (!global.otpStore) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }
    
    const storedOTPData = global.otpStore.get(email);

    if (!storedOTPData) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedOTPData.expiresAt) {
      if (global.otpStore) {
        global.otpStore.delete(email);
      }
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 401 }
      );
    }

    // OTP is valid - proceed with authentication
    let user;

    if (storedOTPData.type === 'register') {
      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        email,
        name: storedOTPData.name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      if (!global.usersStore) {
        global.usersStore = new Map();
      }

      global.usersStore.set(userId, user);

      // Note: Welcome email feature can be added later
      // await sendWelcomeEmail(email, user.name);

      console.log(`✅ New user registered: ${email}`);
    } else {
      // Sign in existing user
      user = Array.from(global.usersStore?.values() || []).find(
        (u: any) => u.email === email
      );

      console.log(`✅ User signed in: ${email}`);
    }

    // Clean up OTP
    if (global.otpStore) {
      global.otpStore.delete(email);
    }

    // Generate session token (simplified for demo)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
