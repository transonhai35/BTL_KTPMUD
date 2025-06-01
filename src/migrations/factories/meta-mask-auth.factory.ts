import { verifyMessage } from 'ethers';
import { buildUsernameFromWalletAddress } from '../../utils/username';
import { IUser } from '../../interfaces/IUser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaMaskAuthFactory {
  async getUserInfo(signature: string, walletAddress: string, message: string): Promise<IUser> {
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
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
