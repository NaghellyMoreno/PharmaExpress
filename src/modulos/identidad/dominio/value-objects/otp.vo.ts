export class OTP {
  public readonly code: string;
  public createdAt: Date;
  public expiresAt: Date;
  public attempts: number;
  public isUsed: boolean;

  constructor(code: string, ttlMinutes: number = 10) {
    this.code = code;
    this.createdAt = new Date();
    this.expiresAt = new Date();
    this.expiresAt.setMinutes(this.createdAt.getTime() + ttlMinutes * 60);
    this.attempts = 0;
    this.isUsed = false;
  }

  public isValid(now?: Date): boolean {
    const date = now ?? new Date();
    return (
      date < this.expiresAt &&
      this.attempts < 3 &&
      !this.isUsed
    );
  }

  public use(): void {
    this.isUsed = true;
  }
}
