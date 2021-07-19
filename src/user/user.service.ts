import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto} from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { UserEmailExistsException } from 'src/exceptions/user-email-exists.exception';
import { UserIdDoesNotExistException } from 'src/exceptions/user-id-does-not-exist.exception';

@Injectable()
export class UserService {

    constructor( @InjectRepository(User)
                 private usersRepository: Repository<User>) {}

    /**
     * Returns all users
     * @returns users
     */
    public async getAll(): Promise<UserDto[]> {
        var returnUsers = [];

        return this.usersRepository.find()
            .then((users: User[]) => {
                users.forEach((elem) => {
                    const item = plainToClass(UserDto, elem);
                    const { password, ...result } = item;
                    returnUsers.push(result);
                });
                return returnUsers;
            });
    }

    /**
     * Find user by id
     * @param id 
     * @returns user
     */
    public async getOne(id: string): Promise<UserDto> {
        return this.usersRepository.findOne(id)
            .then((user: User) => {
                if(!user)
                    throw new UserIdDoesNotExistException();
                
                const returnUser = plainToClass(UserDto, user);
                const { password, ...result } = returnUser;
                return result;
            });
    }

    /**
     * Find user by email
     * @param email 
     * @returns user
     */
    async findByEmail(email: string): Promise<UserDto | undefined> {
        return this.usersRepository.findOne({ email: email.toLocaleLowerCase() })
            .then((user: User) => {
                if(!user)
                    throw new UserEmailExistsException();

                const retUser = plainToClass(UserDto, user);
                return retUser;
            });
      }
    
    /**
     * Create user
     * @param createUser 
     * @returns user
     */
    public async createUser(createUser: CreateUserDto) : Promise<UserDto> {
        return this.usersRepository.findOne({ email: createUser.email.toLocaleLowerCase() })
            .then((user: User) => {
                if(user)
                    throw new UserEmailExistsException();
                
                return this.hashPassword(createUser.password)
                    .then(async (password: string) => {
                        createUser.password = password;
                        const userDb = plainToClass(User, createUser);
                    
                        user = await this.usersRepository.save(userDb);
                        const retUser = plainToClass(UserDto, user);
                        return retUser;
                    });
            });
    } 

    public async updateUser(id: string, updateUser: UpdateUserDto): Promise<void> {
        return this.usersRepository.findOne(id)
            .then( async (user: User) => {
                if(!user)
                    throw new UserIdDoesNotExistException();

                if( updateUser.email  && updateUser.email != user.email) {
                    const userEmail = await this.usersRepository.findOne({ email: updateUser.email.toLocaleLowerCase() });

                    if(userEmail) 
                        throw new UserEmailExistsException();
                }
                await this.usersRepository.update(id, updateUser);
        });          
                
    }

    public async deleteUser(id: string): Promise<void> {
        return this.usersRepository.findOne(id)
            .then((user: User) => {
                if(!user)
                    throw new UserIdDoesNotExistException();

                this.usersRepository.softRemove(user);
            });
    }

    /**
     * Hashes the password using a bcrypt.hash() 
     * @param password 
     * @returns string
     */
    hashPassword(password: string): Promise<string> {
        return bcrypt.genSalt()
        .then((salt: string) => {
            return bcrypt.hash(password, salt);
        });
    }

    /**
     * Compares new and passwordHash using a bcrypt.compare
     * @param newPassword 
     * @param passwordHash 
     * @returns boolean
     */
    async comparePasswords(newPassword: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(newPassword,passwordHash);
    }

    /**
     * Checks if the user with that mail exists
     * @param email 
     * @returns boolean
     */
    checkMailExist(email: string): boolean {
        if(this.usersRepository.findOne({ where: {email} }))
            return true;
        return false;
    }

    async getUserByEmail(email: string): Promise<UserDto> {
        return this.usersRepository.findOne({ email: email })
            .then((user: User) => {
                if(!user)
                    throw new NotFoundException('User with that email does not exist');

                const returnUser = plainToClass(UserDto, user);
                return returnUser;
            });
    }
}
