import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, NotificationToken } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([
      Notification,
      NotificationToken,
      User
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
