import { IsEmail, IsNotEmpty, Length} from "class-validator";

//Class for Create user
export class CreateUserDto {
    
    @Length(2, 15, {message: 'Length for first name must be between 3 and 15 chars.'})
    firstName: string;

    @Length(3, 15, {message: 'Length for last name must be between 3 and 15 chars.'})
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(8, 15, {message: 'Length for password must be between 8 and 15 chars.'})
    password: string;
}
