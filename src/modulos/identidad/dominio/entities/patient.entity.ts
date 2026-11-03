import { v4 as uuidv4 } from 'uuid';
import { argon2 } from 'argon2';
import { OTP } from '../value-objects/otp.vo';
import { Consent } from '../value-objects/consent.vo';

export class Patient {
  public readonly id: string;
  public readonly cedulaHash: string;
  public otp: OTP | null;
  public consent: Consent | null;
  public linkedChannel: string;
  public linkedChannelExpires: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    cedulaPlain: string,
    otp: OTP | null = null,
    consent: Consent | null = null,
    linkedChannel: string = '',
    linkedChannelExpires: Date = new Date(),
  ) {
    this.id = uuidv4();
    this.cedulaHash = this.hashCedula(cedulaPlain);
    this.otp = otp;
    this.consent = consent;
    this.linkedChannel = linkedChannel;
    this.linkedChannelExpires = linkedChannelExpires;
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  private hashCedula(plain: string): string {
    return argon2.hash(plain);
  }

  public isOtpValid(now?: Date): boolean {
    if (!this.otp) return false;
    return this.otp.isValid(now);
  }

  public canRequestOtp(): boolean {
    return !this.otp || !this.otp.isValid();
  }

  public incrementOtpAttempt(): void {
    if (this.otp) {
      this.otp.attempts += 1;
      if (this.otp.attempts >= 3) {
        this.otp.isUsed = true;
      }
    }
  }

  public resetOtp(): void {
    this.otp = null;
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
