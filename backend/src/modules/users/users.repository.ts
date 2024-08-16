import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Auth0Dto,
  CreateUserDto,
  updateUserAdminInfoDto,
  UpdateUserDto,
  UpdateUserPersonalInfoDto,
} from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';
import { Role } from './dto/roles.enum';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailingService: MailingService,
  ) {}

  async getUsers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const users = await this.usersRepository.find({
        take: limit,
        skip: skip,
      });
      const passwordlessUsers = users.map((user) => {
        const usersArray = [];
        const { password, ...userWithoutPassword } = user;
        usersArray.push(userWithoutPassword);
        return usersArray;
      });
      return passwordlessUsers;
    } catch (error) {
      console.error('Error obteniendo los usuarios:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener los usuarios.',
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: { orders: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${userId}`,
        );
      }
      return user;
    } catch (error) {
      console.error(`Error obteniendo el usuario con el id ${userId}:`, error);
      throw new InternalServerErrorException(
        `No se pudo obtener el usuario con id ${userId}.`,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el usuario con el email ${email}`,
      );
    }
  }

  async createUser(user: CreateUserDto) {
    const { email, date } = user;
    try {
      if (typeof date === 'string') {
        user.date = new Date(date);
      }

      await this.usersRepository.save(user);
      const findUser = await this.findByEmail(email);
      const { role, ...finalUser } = findUser;

      try {
        await this.mailingService.sendWelcomeEmail(email);
        console.log('Correo de bienvenida enviado correctamente');
      } catch (mailError) {
        console.error('Error al enviar el correo:', mailError.message);
      }

      return finalUser;
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async createAuth0User(userDto: Auth0Dto) {
    const { authId, email, name } = userDto;
    try {
      const user = new User();
      user.authId = authId;
      user.name = name;
      user.email = email;
      const encryptedPassword = await bcrypt.hash(authId, 10);
      user.password = encryptedPassword;
      await this.usersRepository.save(user);
      const findUser = await this.findByEmail(email);
      const { role, ...finalUser } = findUser;

      try {
        await this.mailingService.sendWelcomeEmail(email);
        console.log('Correo de bienvenida enviado correctamente');
      } catch (mailError) {
        console.error('Error al enviar el correo:', mailError.message);
      }

      return finalUser;
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async updateFullUser(userId: string, user: Partial<UpdateUserDto>) {
    try {
      await this.usersRepository.update(userId, user);
      const updatedUser = await this.usersRepository.findOneBy({ id: userId });
      if (!updatedUser) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${userId}`,
        );
      }
      const { password, role, ...finalUser } = updatedUser;
      return finalUser; //? mostrar si password ok, pero sin role porque?
    } catch (error) {
      console.error(
        `Error actualizando el usuario con el id ${userId}:`,
        error,
      );
      throw new InternalServerErrorException(
        `No se pudo actualizar el usuario con el id ${userId}.`,
      );
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${userId}`,
        );
      }
      await this.usersRepository.remove(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error eliminando el usuario con el id ${userId}:`, error);
      throw new InternalServerErrorException(
        `No se pudo eliminar el usuario con el id ${userId}.`,
      );
    }
  }

  async updateUserRole(userId: string, newRole: Role, currentUser: any) {
    if (userId === currentUser.id) {
      throw new ForbiddenException('You cannot change your own role.');
    }

    if (currentUser.role === Role.SuperAdmin) {
      if (newRole === Role.SuperAdmin) {
        throw new ForbiddenException(
          'SuperAdmin cannot assign SuperAdmin role',
        );
      }
    } else if (currentUser.role === Role.Admin) {
      if (![Role.User, Role.Banned].includes(newRole)) {
        throw new ForbiddenException(
          'Admin can only assign User or Banned roles',
        );
      }
    } else {
      throw new ForbiddenException('Unauthorized');
    }
    //? esto se puede optimizar para que lo maneje por su cuenta en vez de usar el otro endpoint.
    //? Que lo maneje directamente el .update de TypeOrm
    await this.updateFullUser(userId, { role: newRole });
    const updatedUser = await this.usersRepository.findOneBy({ id: userId });
    const { password, ...finalUser } = updatedUser;
    return finalUser;
  }

  async updateUserPersonalInfo(
    userId: string,
    user: UpdateUserPersonalInfoDto,
  ) {
    await this.usersRepository.update(userId, user);
    return user;
  }

  async updateUserAdminInfo(userId: string, user: updateUserAdminInfoDto) {
    await this.usersRepository.update(userId, user);
    return user;
  }

  //! DEJAR COMENTADO / DESACTIVADO PARA NO HACER SPAM
  //@Cron('0 0 * * 0')
  async sendWeeklyEmailToAllUsers() {
    console.log('Mailing Automatico Semanal Iniciado...');

    try {
      const page = 1;
      const limit = 1000;
      const result: any[][] = await this.getUsers(page, limit);
      const allUsers: User[] = result.flat(); //! Aplana la matriz bidimensional, debido a que el getUsers retorna Users[][]

      for (const user of allUsers) {
        await this.mailingService.sendWeMissYouEmail(user.email);
        console.log(`Correos enviadado a ${user.email} correctamente`);
      }
    } catch (error) {
      console.error('Error al enviar correos semanales:', error);
    }
  }
}
