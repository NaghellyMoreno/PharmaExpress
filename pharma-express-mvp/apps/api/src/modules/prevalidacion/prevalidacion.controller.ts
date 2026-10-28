import { Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PacienteGuard } from '../../common/paciente.guard';
import { ArchivoCargado, PrevalidacionService } from './prevalidacion.service';

const TIPOS = /^(image\/(jpeg|png|webp|heic)|application\/pdf)$/;

@UseGuards(PacienteGuard)
@Controller('solicitudes')
export class PrevalidacionController {
  constructor(private s: PrevalidacionService) {}

  /** multipart: formulas[] (fotos o PDF), historia (foto o PDF), numeros (JSON), reintento, ilegibles (JSON, solo pruebas). */
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'formulas', maxCount: 10 }, { name: 'historia', maxCount: 3 }], {
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_req, f, cb) => cb(null, TIPOS.test(f.mimetype)),
    }),
  )
  crear(@Req() req: any, @UploadedFiles() files: Record<string, ArchivoCargado[]>, @Body() body: Record<string, string>) {
    const archivos = [...(files?.formulas ?? []), ...(files?.historia ?? [])];
    const numeros: string[] = JSON.parse(body.numeros ?? '[]');
    const ilegibles: string[] = JSON.parse(body.ilegibles ?? '[]');
    return this.s.crearSolicitud(req.paciente.cedula, 'WEB', numeros, archivos, body.reintento === 'true', ilegibles);
  }

  @Get('estado')
  estado(@Req() req: any) {
    return this.s.estado(req.paciente.cedula);
  }
}
