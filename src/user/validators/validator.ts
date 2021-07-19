import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../user.service";


@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {

  constructor(private userService: UserService) {}

  async validate(value: string) {
      return this.userService.checkMailExist(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `User with email exist`;
  }
}