import { Length } from "class-validator";

export class ChangePasswordDto {
  
    password: string;
  
    @Length(8, 15, {message: 'Length for password must be between 8 and 15 chars.'})
    newPassword: string
  }