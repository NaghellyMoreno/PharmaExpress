export type ConsentType = 'titular' | 'tercero';

export class Consent {
  public acceptedAt: Date;
  public revokedAt: Date | null;
  public type: ConsentType;
  public channelReference: string;
  public isRevoked: boolean;

  constructor(
    acceptedAt: Date,
    type: ConsentType,
    channelReference: string,
  ) {
    this.acceptedAt = acceptedAt;
    this.type = type;
    this.channelReference = channelReference;
    this.isRevoked = false;
    this.revokedAt = null;
  }

  public revoke(): void {
    this.isRevoked = true;
    this.revokedAt = new Date();
  }

  public isActive(): boolean {
    return !this.isRevoked && this.acceptedAt !== undefined;
  }
}
