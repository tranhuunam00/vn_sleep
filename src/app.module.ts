import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './common/guard/role.guard';
import { AuthGuard } from './common/guard/auth.guard';
import { ResponseConfigInterceptor } from './common/interceptor/tranform.interceptor';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // envFilePath: ['.env.development.local', '.env.development'],
    }),
    MailerModule.forRoot({
      transport: {
        // host: 'smtp.example.com',
        service: 'gmail',
        secure: false,
        // port: 587,
        auth: {
          type: 'OAuth2',
          user: process.env.ADMIN_EMAIL_ADDRESS,
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        options: {
          strict: true,
        },
      },
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseConfigInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
      .forRoutes(CatsController);
  }
}
