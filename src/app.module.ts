import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserDocInterceptor } from './auth/interceptors/user-doc.interceptor';
import { FileProcessorService } from './common/file-processor/file-processor.service';
import { FileProcessorModule } from './common/file-processor/file-processor.module';
import { OrganizaitionModule } from './organizaition/organizaition.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    FirebaseModule,

    AuthModule,
    FileProcessorModule,
    OrganizaitionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserDocInterceptor, // Apply interceptor globally
    },
  ],
  exports: [],
})
export class AppModule {}
