/* eslint-disable prettier/prettier */
import CryptoJS from 'crypto-js';

export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('No encrypted data provided');
  }

  try {
    const [ivHex, encryptedTextHex] = encryptedData.split(':');

    if (!ivHex || !encryptedTextHex) {
      throw new Error('Invalid encrypted data format');
    }

    const key = CryptoJS.enc.Hex.parse(process.env.EXPO_PUBLIC_ENCRYPTION_KEY!);
    console.log(encryptedData);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedText = CryptoJS.enc.Hex.parse(encryptedTextHex);

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext: encryptedText }),
      key,
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
