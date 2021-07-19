import { IsEmail, IsOptional, Length } from "class-validator";

export class UpdateUserDto {
    
    @Length(2, 15, {message: 'Length for first name must be between 3 and 15 chars.'})
    @IsOptional()
    firstName: string;

    @Length(3, 15, {message: 'Length for last name must be between 3 and 15 chars.'})
    @IsOptional()
    lastName: string;

    @IsEmail()
    @IsOptional()
    email: string;
}