import { IsNotEmpty } from "class-validator";

export class UpdateSeenOnDto {
    
    @IsNotEmpty()
    userId: string;
}
