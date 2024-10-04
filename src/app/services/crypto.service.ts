import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private keyPromise: Promise<CryptoKey>;

  constructor() {
    const keyString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.keyPromise = this.importKey(keyString);
  }

  private async importKey(keyString: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyString);

    // Hash the key string to ensure it is 256 bits
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

    return crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const key = await this.keyPromise;
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      dataBuffer
    );

    const encryptedBuffer = new Uint8Array(encryptedData);
    const resultBuffer = new Uint8Array(iv.length + encryptedBuffer.length);
    resultBuffer.set(iv);
    resultBuffer.set(encryptedBuffer, iv.length);

    return this.base64UrlEncode(resultBuffer);
  }

  async decryptData(encryptedData: string): Promise<string | null> {
    try {
      // Decode base64 encoded data
      const dataBuffer = this.base64UrlDecode(encryptedData);
  
      const iv = dataBuffer.slice(0, 12);
      const encryptedBuffer = dataBuffer.slice(12);
  
      const key = await this.keyPromise;
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encryptedBuffer
      );
  
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      
      return null; // Return null or an empty string instead of re-throwing the error
    }
  }

  private base64UrlEncode(buffer: Uint8Array): string {
    let base64String = btoa(String.fromCharCode(...buffer));
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlDecode(base64Url: string): Uint8Array {
    let base64String = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = 4 - (base64String.length % 4);
    if (padding !== 4) {
      base64String += '='.repeat(padding);
    }
    return Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
  }
}
