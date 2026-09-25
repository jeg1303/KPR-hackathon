export {};

declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number; name?: string; type?: string }> | undefined;
  var usersStore: Map<string, { id: string; email: string; name: string; createdAt: string }> | undefined;
}
