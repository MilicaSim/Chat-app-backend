import { Body, Controller, Delete, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Post, Put, UsePipes, ValidationPipe, Request, Query } from '@nestjs/common';
import { MessageIdDoesNotExistException } from 'src/exceptions/message-id-does-not-exist.exception';
import { UserIdDoesNotExistException } from 'src/exceptions/user-id-does-not-exist.exception';
import { ChatService } from './chat.service';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { UserChat } from 'src/entities/functions/user-chat.function';
import { PaginationDto } from '../pagination/dtos/pagination.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { UpdateSeenOnDto } from './dtos/update-seen-on.dto';

@Controller('chat')
export class ChatController {
    
    constructor( private chatService: ChatService ) {}
  
      @Get('/messages')
      async getAllMessagesWithUser(@Request() req, @Query('id') id: string, @Query() paginationDto: PaginationDto<MessageDto>): Promise<PaginationDto<MessageDto>> {
        return this.chatService.getAllMessagesWithUser(req.user.id, id, paginationDto);
      }

      @Get(':id')
      async getOneMessage(@Param('id', new ParseUUIDPipe()) id: string): Promise<MessageDto> { 
        return this.chatService.getOneMessage(id)
          .catch((error: Error) => {
            if(error instanceof MessageIdDoesNotExistException)
              throw new NotFoundException("Message with that id does not exist.");

            throw new InternalServerErrorException();
          });
      }

      @Get()
      async getUserChats(@Request() req): Promise<UserChat[]> {
        return this.chatService.getUserChats(req.user.id);
      }

      @Post()
      @UsePipes(new ValidationPipe({transform: true}))
      async sendMessage(@Request() req, @Body() sentMessageDto: SendMessageDto): Promise<MessageDto> {
        return this.chatService.sendMessage(req.user.id, sentMessageDto)
          .then((message: MessageDto) => {
              return message;
          })
          .catch((error: Error) => {
            if(error instanceof UserIdDoesNotExistException)
              throw new NotFoundException('User with that id does not exist');

            throw new InternalServerErrorException();
          });
      }

      @Put(':id')
      @HttpCode(204)
      async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<void> {
        return this.chatService.updateMessage(id, updateMessageDto)
          .catch((error: Error) => {
            if(error instanceof MessageIdDoesNotExistException)
              throw new NotFoundException("Message with that id does not exist.");

            throw new InternalServerErrorException();
          });
      }

      @Post('seen')
      @HttpCode(204)
      async updateSeenOn(@Request() req, @Body() updateSeenOn: UpdateSeenOnDto ): Promise<void> {
        return this.chatService.updateMessageSeenOn(req.user.id, updateSeenOn.userId)
          .catch((error: Error) => {
            if(error instanceof MessageIdDoesNotExistException)
              throw new NotFoundException("Message with that id does not exist.");

            throw new InternalServerErrorException();
          });
      }

      @Delete(':id')
      @HttpCode(204)
      async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.chatService.deleteMessage(id)
          .catch((error: Error) => {
            if(error instanceof MessageIdDoesNotExistException)
              throw new NotFoundException("Message with that id does not exist.");
              
            throw new InternalServerErrorException();
          });
      }
}
