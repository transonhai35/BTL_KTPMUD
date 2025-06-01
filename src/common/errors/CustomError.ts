export enum ErrorCodes {
  UserOtpNotfound = 'UserOtpNotfound',
  UserOtpInvalid = 'UserOtpInvalid',
  UserAlreadyVerified = 'UserAlreadyVerified',
  EmailAlreadyVerified = 'EmailAlreadyVerified',
  PhoneAlreadyVerified = 'PhoneAlreadyVerified',
}

export class CustomError extends Error {
  code: string;
  message: string;
  error?: any;

  constructor(code: string, message?: string, error?: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.error = error;
  }

  withError(err: Error) {
    this.error = err;
    return this;
  }
}
