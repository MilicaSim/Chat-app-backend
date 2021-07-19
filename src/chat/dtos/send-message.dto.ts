import { IsNotEmpty } from "class-validator";

export class SendMessageDto {
    
    @IsNotEmpty()
    forUserId: string;

    @IsNotEmpty()
    message: string;
}
