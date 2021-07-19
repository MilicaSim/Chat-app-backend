import { Exclude, Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';


@Entity({name:'users'})
@Exclude()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({name:'first_name'})
  @Expose()
  firstName: string;

  @Column({name:'last_name'})
  @Expose()
  lastName: string;

  @Column({name:'email'})
  @Expose()
  email: string;

  @Column({name:'password'})
  @Expose()
  password: string;

  @CreateDateColumn({name:'created_on'})
  createdOn: Date;

  @DeleteDateColumn({name:'deleted_on'})
  deletedOn: Date;
  
  @UpdateDateColumn({name:'updated_on'})
  updateOn: Date;

  @Column({name:'is_inactive'})
  isInactive: boolean;

  @BeforeInsert()
  emailToLowerCase(){
    this.email=this.email.toLowerCase();
  }
}