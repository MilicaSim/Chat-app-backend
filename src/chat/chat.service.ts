import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Message } from 'src/entities/message.entity';
import { MessageIdDoesNotExistException } from 'src/exceptions/message-id-does-not-exist.exception';
import { UserIdDoesNotExistException } from 'src/exceptions/user-id-does-not-exist.exception';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { createQueryBuilder, FindConditions, Repository } from 'typeorm';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { UserChat } from 'src/entities/functions/user-chat.function';
import { PaginationDto } from '../pagination/dtos/pagination.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { AppGateway } from 'src/app.gateway';
import { WebSocketDto } from './dtos/webSocket.dto';
import { SocketEvent } from '../enums/socket-event.enum'
import { PaginationService } from '../pagination/pagination.service';
import {getConnection} from "typeorm";
import { Sort } from 'src/enums/sort.enum';

@Injectable()
export class ChatService {

    constructor( @InjectRepository(Message)
                private messageRepository: Repository<Message>,
                private userService: UserService,
                private gateway: AppGateway,
                private paginationService: PaginationService ) {}

    /**
     * Finds message by id
     * @param id 
     * @returns message
     */
    public async getOneMessage(id: string): Promise<MessageDto> {
        return this.messageRepository.findOne(id)
            .then((message: Message) => {
                if(!message)
                    throw new MessageIdDoesNotExistException();
                
                const returnMessage = plainToClass(MessageDto, message);
                return returnMessage;
            });
    }

    /**
     * Finds chats for userId
     * @param userId 
     * @returns UserChats
     */
    public async getUserChats(userId: string): Promise<UserChat[]> {
        return createQueryBuilder(UserChat, 'cw')
        .setParameters({userId: userId})
        .disableEscaping()
        .orderBy('last_message_on', 'DESC')
        .getMany();
    }
    
    /**
     * Finds all messages between two users
     * @param fromUserId 
     * @param forUserId 
     * @param limit 
     * @param page 
     * @returns paginationDto
     */
    public async getAllMessagesWithUser(fromUserId: string, forUserId: string, paginationDto: PaginationDto<MessageDto>): Promise<PaginationDto<MessageDto>> {
        
        const findCondition= ({ 
            where: [
                {fromUserId: fromUserId, forUserId: forUserId},
                {fromUserId: forUserId , forUserId: fromUserId}
            ],
            order: {
                createdOn: Sort.DESC
              }
        }) as  FindConditions<Message>;

        return this.paginationService.paginate(this.messageRepository, findCondition, paginationDto);
    }

    /**
     * Send message to user
     * @param fromUserId 
     * @param sendMessage 
     * @returns message
     */
    public async sendMessage(fromUserId: string, sendMessage: SendMessageDto) : Promise<MessageDto> {
        return this.userService.getOne(sendMessage.forUserId)
            .then((user: UserDto) => {
                if(!user)
                    throw new UserIdDoesNotExistException();

                var messageDb = plainToClass(Message, sendMessage);  
                messageDb.fromUserId = fromUserId;
                const message = this.messageRepository.save(messageDb);

                const retMessage = plainToClass(MessageDto, message);

                const wsdto = plainToClass(WebSocketDto, message);
                wsdto.type = SocketEvent.Message;
                wsdto.fromUserId = messageDb.fromUserId;
                this.gateway.wss.emit(sendMessage.forUserId, wsdto);

                return retMessage;
            });
    }

    public async updateMessage(id: string, updateMessage: UpdateMessageDto): Promise<void> {
        return this.messageRepository.findOne(id)
            .then( async (message: Message) => {
                if(!message)
                    throw new MessageIdDoesNotExistException();

                await this.messageRepository.update(id, updateMessage);
            });
    }

    public async updateMessageSeenOn(loggedInUserId: string, fromUserId: string): Promise<void> {
        
        return this.userService.getOne(fromUserId)
            .then(async (user: UserDto) => {
                if(!user)
                    throw new UserIdDoesNotExistException();

                await getConnection()
                .createQueryBuilder()
                .update(Message)
                .set({ seenOn: new Date()})
                // .where("fromUserId = :fromuserId, ", { fromUserId: fromUserId })
                // .andWhere("forUserId = :forUserId, ", { forUserId: loggedInUserId })
                // .andWhere("seenOn = :seenOn, ", { seenOn: null })
                .where({fromUserId: fromUserId , forUserId: loggedInUserId, seenOn: null})
                .execute();

                const wsdto: WebSocketDto = new WebSocketDto();
                wsdto.type = SocketEvent.Seen;
                wsdto.fromUserId = loggedInUserId;
                this.gateway.wss.emit(fromUserId, wsdto);
            });
                    
    }

    public async deleteMessage(id: string): Promise<void> {
        return this.messageRepository.findOne(id)
            .then((message: Message) => {
                if(!message)
                    throw new MessageIdDoesNotExistException();

                this.messageRepository.softRemove(message);
            });
    } 
}
