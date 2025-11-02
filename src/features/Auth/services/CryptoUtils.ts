/**
 * Cryptographic utilities for password hashing and verification
 */

export class CryptoUtils {
  private static generateSalt(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    // Simple hash for demo - in production use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  static async hashPasswordSecure(password: string): Promise<{ hash: string; salt: string }> {
    const salt = this.generateSalt();
    const hash = await this.hashPassword(password, salt);
    return { hash, salt };
  }

  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const newHash = await this.hashPassword(password, salt);
    return newHash === hash;
  }
}
