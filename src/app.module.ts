import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [NotificationModule, UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
     TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,   
      database: process.env.DATABASE_NAME,
      // synchronize: true,   
      autoLoadEntities: true,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
