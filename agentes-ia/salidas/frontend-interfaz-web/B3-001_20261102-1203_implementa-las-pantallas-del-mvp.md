<!--
Agente: B3 Interfaz web
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 12:03
Petición: Implementa las pantallas del MVP
-->

```file:apps/web/src/api/types.ts
export interface AuthLoginRequest {
  cedula: string;
  code: string;
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface VerifyCodeRequest {
  cedula: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
}

export interface UploadRequest {
  file: File;
}

export interface OcrResult {
  formulaNumber: string;
  medications: string[];
  diagnosis?: string;
}

export interface ConfirmationRequest {
  documentId: string;
  approved: boolean;
}

export interface ConfirmationResponse {
  success: boolean;
  message: string;
}

export interface ReservationRequest {
  medicationId: string;
  windowStart: string; // ISO datetime
  windowEnd: string;     // ISO datetime
}

export interface ReservationResponse {
  success: boolean;
  reservationId: string;
  qrCode: string;
  numericCode: string;
}

export interface MyReservationResponse {
  reservationId: string;
  qrCode: string;
  numericCode: string;
  medication: string;
  window: string;
}

export interface ScanRequest {
  qrCode: string;
}

export interface ScanResponse {
  success: boolean;
  message: string;
}
```

```file:apps/web/src/api/client.ts
import { AuthLoginRequest, AuthLoginResponse, VerifyCodeRequest, VerifyCodeResponse, UploadRequest, OcrResult, ConfirmationRequest, ConfirmationResponse, ReservationRequest, ReservationResponse, MyReservationResponse, ScanRequest, ScanResponse } from './types';

const API_BASE = import.meta.env.VITE_API_URL as string;

export const api = {
  async login(request: AuthLoginRequest): Promise<AuthLoginResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Login failed');
    }
    return res.json();
  },

  async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const res = await fetch(`${API_BASE}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Verify code failed');
    }
    return res.json();
  },

  async uploadFile(file: File): Promise<{ documentId: string; extracted: OcrResult }> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/prevalidation/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Upload failed');
    }
    return res.json();
  },

  async confirm(documentId: string, approved: boolean): Promise<ConfirmationResponse> {
    const res = await fetch(`${API_BASE}/prevalidation/confirm`, {
      method: 'POST',
      headers: { 'Content-Type
