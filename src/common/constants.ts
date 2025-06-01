
export const MAX_FAILED_LOGIN_ATTEMPTS = Number(process.env.MAX_FAILED_LOGIN_ATTEMPTS) || 5;
export const LOCK_TIME_AFTER_FAILED_ATTEMPTS = Number(process.env.LOCK_TIME_AFTER_FAILED_ATTEMPTS) || 5;
export const EMAIL_VERIFICATION_EXPIRATION = Number(process.env.EMAIL_VERIFICATION_EXPIRATION) || 6; // 6 hours
export const FORGOT_PASSWORD_EXPIRATION = Number(process.env.FORGOT_PASSWORD_EXPIRATION) || 15; // 15 minutes
export const OTP_PHONE_VERIFICATION_EXPIRATION = Number(process.env.OTP_PHONE_VERIFICATION_EXPIRATION) || 15;  // 15 minutes
export const RESEND_VERIFICATION_CODE_DELAY_MINUTES = Number(process.env.RESEND_VERIFICATION_CODE_DELAY_MINUTES ) || 1; // delay resend verification code in every minute;
export const MAX_FAILED_VERIFY_ATTEMPTS = Number(process.env.MAX_FAILED_VERIFY_ATTEMPTS) || 3; // maximum number of failed verify attempts
