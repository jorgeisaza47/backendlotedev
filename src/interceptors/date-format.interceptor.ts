import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Formatear y ordenar fechas en la respuesta
        return this.formatDatesInResponse(data);
      }),
    );
  }

  private formatDatesInResponse(data: any): any {
    if (data && typeof data === 'object') {
      for (const key of Object.keys(data)) {
        if (data[key] instanceof Date) {
          data[key] = format(data[key], 'yyyy-MM-dd'); // Formatear la fecha
        } else if (Array.isArray(data[key])) {
          // Si es un array, ordenar y formatear las fechas
          data[key] = data[key]
            .map((item: any) =>
              item instanceof Date ? format(item, 'yyyy-MM-dd') : item,
            )
            .sort((a, b) => {
              const dateA = new Date(a).getTime();
              const dateB = new Date(b).getTime();
              return dateB - dateA; // Orden ascendente
            });
        } else if (typeof data[key] === 'object') {
          this.formatDatesInResponse(data[key]); // Llamada recursiva
        }
      }
    }
    return data;
  }
}
