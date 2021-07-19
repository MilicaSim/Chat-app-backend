import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { UserChat } from 'src/entities/functions/user-chat.function';
import { Message } from 'src/entities/message.entity';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AppGateway, PaginationService],
  imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => UserModule),
            TypeOrmModule.forFeature([UserChat])]
})
export class ChatModule {}
