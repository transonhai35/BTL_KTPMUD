import { IAuthFactory } from "../interfaces/IAuthFactory";
import appleSignin from 'apple-signin-auth';

export class AppleAuthFactory implements IAuthFactory {

  async getUserInfo(token: string) {
    const result = await appleSignin.verifyIdToken(token, {
      // Optional Options for further verification - Full list can be found here https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      audience: '', // client id - can also be an array
      // nonce: 'NONCE', // nonce // Check this note if coming from React Native AS RN automatically SHA256-hashes the nonce https://github.com/invertase/react-native-apple-authentication#nonce
      // If you want to handle expiration on your own, or if you want the expired tokens decoded
      ignoreExpiration: true, // default is false
    });
    const {sub: id, email} = result;
    return { id, email, name: email };
  }

}