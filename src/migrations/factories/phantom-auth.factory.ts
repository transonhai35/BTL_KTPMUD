import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { IUser } from '../../interfaces/IUser';
import { buildUsernameFromWalletAddress } from '../../utils/username';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhantomAuthFactory {
  async getUserInfo(signature: string, walletAddress?: string, message?: string): Promise<IUser> {
    const encodedMessage = new TextEncoder().encode(message);
    const decodedSignature = Uint8Array.from(Buffer.from(signature, 'base64'));
    const publicKey = new PublicKey(walletAddress);

    const isValid = nacl.sign.detached.verify(
      encodedMessage,
      decodedSignature,
      publicKey.toBytes()
    );
    
    if (!isValid) {
      throw new Error('Signature verification failed');
    }

    const username = buildUsernameFromWalletAddress(walletAddress);

    return {
      id: walletAddress,
      email: null,
      name: username,
      username: username,
      avatar: null,
      walletAddress,
    };
  }
}
