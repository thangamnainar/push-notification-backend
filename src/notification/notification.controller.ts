import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Request,Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('login')
async login(@Req() req: Request, @Res() res: Response, @Body() createNotifyTokenDto: any) {
  try {
    console.log('createNotifyTokenDto', createNotifyTokenDto);

    const checkEmail = await this.notificationService.checkEmail(createNotifyTokenDto.email);
    if (!checkEmail) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid email' });
    }

    if (!createNotifyTokenDto.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Password is missing' });
    }

    const match = await bcrypt.compare(createNotifyTokenDto.password, checkEmail.password);
    console.log('match', match);

    if (match) {
      console.log('password match');
      // Proceed with login logic here
      let result =await this.notificationService.sendPush(checkEmail.id);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid password' });
    }

    console.log('checkEmail', checkEmail);
    return res.status(HttpStatus.OK).json({
      message: 'Login success',
      data: checkEmail,
    });
  } catch (err) {
    console.log('err', err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
}


  @Post('signUp')
  async signUp (@Req() req:Request,@Res() res:Response,@Body() createNotifyTokenDto: any){
    try{
      createNotifyTokenDto['password'] = await bcrypt.hash(createNotifyTokenDto.password, 10);
      const savedata = await this.notificationService.signUp(createNotifyTokenDto)
      return res.status(HttpStatus.OK).json({
        message:"save data success",
        data:savedata
      })
    }catch(error){
      console.log('error',error);
    }
  }

  @Post('saveToken')
  async createToken(@Req() req:Request,@Res() res:Response,@Body() createNotifyTokenDto: any) {
    try{
      let result =await this.notificationService.saveNotificationToken(createNotifyTokenDto.userId,createNotifyTokenDto);
      console.log(result);
      return res.status(HttpStatus.OK).json({
        message:"Token inserted successfully",
      })
    }catch(err){
      console.log(err)
    }
}

@Post('sendNotification')
  async sendNotification(@Req() req:Request,@Res() res:Response,@Body() createNotificationDto: any) {
    try{
      createNotificationDto['title'] = 'test title';
      createNotificationDto['body'] = 'test Notification';
      // let result =await this.notificationService.sendPush(createNotificationDto.userId);
      // console.log(result);    
      return res.status(HttpStatus.OK).json({
        message:"Notification data saved successfully",
      })
    }catch(err){
      console.log(err)
    }
}
}
