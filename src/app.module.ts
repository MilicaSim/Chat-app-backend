import { PaginationService } from './pagination/pagination.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppGateway } from './app.gateway';

@Module({
  imports: [UserModule, AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User],
      synchronize: false,
      autoLoadEntities: true,
      //logging: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    PaginationService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppGateway
  ],
  exports: [AppGateway]

})
export class AppModule { }
