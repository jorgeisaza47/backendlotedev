import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesModule } from './lotes/lotes.module';
import { FilesModule } from './files/files.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AguacateModule } from './aguacate/aguacate.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontendlote', 'browser'),
      serveRoot: '/', // Sirve los archivos estáticos desde la raíz
      exclude: ['/api/(.*)'], // <--- ¡¡¡ESTO ES CLAVE!!! Excluye todas las rutas que comiencen con /api
      serveStaticOptions: {
        index: 'index.csr.html', // Indica que use este archivo como índice
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    LotesModule,
    TransactionsModule,
    FilesModule,
    TransactionsModule,
    AguacateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
