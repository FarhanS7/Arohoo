/**
 * Provider for future OTP-based authentication.
 * Placeholder implementation to demonstrate extensibility.
 */
export class OtpProvider {
  static generateOtp() {
    // Logic to generate 6-digit code
    return '000000';
  }

  static async verify(otp, hash) {
    // Logic to verify OTP against hash
    return otp === '000000';
  }
}
