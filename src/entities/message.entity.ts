import { Exclude, Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';


@Entity({name:'messages'})
@Exclude()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({name:'from_user_id'})
  @Expose()
  fromUserId: string;

  @Column({name:'for_user_id'})
  @Expose()
  forUserId: string;

  @Column({name:'message'})
  @Expose()
  message: string;

  @CreateDateColumn({name:'created_on'})
  createdOn: Date;

  @DeleteDateColumn({name:'deleted_on'})
  deletedOn: Date;
  
  @UpdateDateColumn({name:'updated_on'})
  updateOn: Date;

  @Column({name:'seen_on'})
  seenOn: Date;
}