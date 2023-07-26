import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationToken } from './entities/notification.entity';
import { privateDecrypt } from 'crypto';
import { User } from 'src/user/entities/user.entity';

firebase.initializeApp({
  credential: firebase.credential.cert(path.join('firebase-admin-sdk.json')),
});

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepository: Repository<NotificationToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    // firebase
    //   .messaging()
    //   .send({
    //     notification: {
    //       title: "Test",
    //       body: "hello World"
    //     },
    //     token: "c_boLVYmdM5IV8VsgfAvhw:APA91bGQrPtDAQpUkp_ThZt5-U16TFAjGECpQR6YYLnLfOajAxIxqG7Y6k38rIjReshlJfr9MWynCpJNTBPOZtnCMox2CnWXV27_0jomHT3M7KXu6i7Gu_g48AP5tNm90pNtbRHU8iv9",
    //   })
    //   .then((response) => {
    //     console.log('Successfully sent message:', response);
    //   })

  }

  async checkEmail(email:string) {
    return await this.userRepository.findOne({where:{userName:email}})
  } 

  async signUp(data:any){
    return await this.userRepository.save(data)
  }



  saveNotificationToken = async (userId: number, notification_dto: any,): Promise<NotificationToken> => {

    await this.notificationTokenRepository.update(
      { userId: userId },
      { isActive: false },
    );
    const notificationToken = await this.notificationTokenRepository.save({
      userId: userId,
      notificationToken: notification_dto.notificationToken,
      isActive: true,
    });
    return notificationToken;
  };

  // disablePushNotification = async (
  //     user: any,
  //     update_dto: NotificationDto,
  //   ): Promise<void> => {
  //     try {
  //       await this.NotificationTokenRespository.update(
  //         { userId: user.id, deviceType: update_dto.deviceType },
  //         {
  //           status: 'INACTIVE',
  //         },
  //       );
  //     } catch (error) {
  //       return error;
  //     }
  //   };

  //   getNotifications = async (): Promise<any> => {
  //     return await this.NotificationRespository.find();
  //   };

  sendPush = async (
    userId: number,
    // title: string,
    // body: string,
  ): Promise<void> => {
    try {
      const notification = await this.notificationTokenRepository.findOne({
        where: { userId: userId, isActive: true },
      });
      console.log(notification, 'notificationnnnnnnnnnnnnn');
      if (notification) {
        await this.notificationRepository.save({
          notificationTokenId: notification.id,
          title:'',
          body:'',
          isActive: true,
        });
        await firebase
          .messaging()
          .send({
            notification: {
              title:'test title',
              body:'test Notification',
            },
            token: "currentTokencurrentToken c_boLVYmdM5IV8VsgfAvhw:APA91bGQrPtDAQpUkp_ThZt5-U16TFAjGECpQR6YYLnLfOajAxIxqG7Y6k38rIjReshlJfr9MWynCpJNTBPOZtnCMox2CnWXV27_0jomHT3M7KXu6i7Gu_g48AP5tNm90pNtbRHU8iv9",
          })
          .then((response) => {
            console.log('Successfully sent message:', response);
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      return error;
    }
  };

  //   sendPushToMultipleUser = async (user: any, title: string, body: string): Promise<void> => {
  //     try {
  //       // let id = user.id
  //       // let status = 'ACTIVE'
  //       const notification = await this.NotificationTokenRespository
  //         .createQueryBuilder('nt')
  //         .select('nt.id, nt.notificationToken')
  //         .where('status = :status',{status:'ACTIVE'})
  //         .execute();
  //     console.log('===========>>>>>>>',notification)
  //       if (notification) {
  //         for (let token of notification){
  //           console.log('>>>>>>>',token)
  //         await this.NotificationRespository.save({
  //           notificationToken: token,
  //           title,
  //           body,
  //           status: 'ACTIVE',
  //           created_by: user.username,
  //         });
  //         await firebase
  //           .messaging()
  //           .send({
  //             notification: { title, body },
  //             token: token.notificationToken,
  //             android: { priority: 'high' },
  //           })
  //           .catch((error: any) => {
  //             console.error(error);
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       return error;
  //     }
  //   };

}