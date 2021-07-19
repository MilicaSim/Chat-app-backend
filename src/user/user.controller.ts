import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, HttpCode, NotFoundException, BadRequestException, ParseUUIDPipe, InternalServerErrorException, Request } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiCreatedResponse } from '@nestjs/swagger'
import { UserDto } from './dto/user.dto';
import { UserEmailExistsException } from 'src/exceptions/user-email-exists.exception';
import { UserIdDoesNotExistException } from 'src/exceptions/user-id-does-not-exist.exception';
import { Public } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {

    constructor( private userService: UserService) {}
    
    @Get('/allUsers')
    async getAll(): Promise<UserDto[]> {
      return this.userService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserDto> { 
      return this.userService.getOne(id)
        .catch((error: Error) => {
          if(error instanceof UserIdDoesNotExistException)
            throw new NotFoundException("User with that id does not exist.");

          throw new InternalServerErrorException();
        });
    }

    @Get()
    getProfile(@Request() req) {
      return req.user;
    }

    @Public()
    @Post()
    @ApiCreatedResponse({type: User})
    @UsePipes(new ValidationPipe({transform: true}))
    async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
      return this.userService.createUser(createUserDto)
        .then((user: User) => {
            return user;
        })
        .catch((error: Error) => {
          if(error instanceof UserEmailExistsException)
            throw new BadRequestException("User with that email already exists");

          throw new InternalServerErrorException();
        });
    }

    @Put(':id')
    @HttpCode(204)
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
      return this.userService.updateUser(id, updateUserDto)
        .catch((error: Error) => {
          if(error instanceof UserEmailExistsException)
            throw new BadRequestException("User with that email already exists.");
          else if(error instanceof UserIdDoesNotExistException)
            throw new NotFoundException("User with that id does not exist.");
            
          throw new InternalServerErrorException();
        });
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
      return this.userService.deleteUser(id)
        .catch((error: Error) => {
          if(error instanceof UserIdDoesNotExistException)
            throw new NotFoundException("User with that id does not exist.");

          throw new InternalServerErrorException();
        });
    }
}
