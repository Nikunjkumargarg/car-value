import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  NotFoundException,
  Patch,
  //UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Auth } from 'typeorm';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
//import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@serialize(UserDto)
//@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {} // Ensure consistent naming
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    console.log(body);
    return user; // Return the created user or a success message
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    console.log(body);
    return user;
  }

  // @Get('/whoami')
  // async whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/user')
  async findAllUsers(@Query('email') email: string) {
    const user = await this.userService.find(email);
    console.log(user);
    if (!user || user.length === 0) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  //@UseInterceptors(ClassSerializerInterceptor)
  //@UseInterceptors(new serializeInterceptor(UserDto))
  //@serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    } // Ensure consistent naming
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
    return this.userService.update(id, body);
  }
}
