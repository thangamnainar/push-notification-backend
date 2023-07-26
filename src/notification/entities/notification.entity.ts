import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => NotificationToken, (nt) => nt.id)
    @JoinColumn({name:'notificationId'})
    notificationId:number;

    @Column()
    title:string;

    @Column()
    body:string;
    
}

@Entity()
export class NotificationToken {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:number;

    @Column()
    notificationToken:string;

    @Column({default:false})
    isActive:boolean;

}
