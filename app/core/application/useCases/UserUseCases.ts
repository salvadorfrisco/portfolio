import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UserUseCases {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(
    id: string,
    name: string,
    email: string,
    phoneNumber?: string,
    photoUrl?: string,
    image_base64?: string,
  ): Promise<User> {
    const user = User.create(
      id,
      name,
      email,
      phoneNumber,
      photoUrl,
      image_base64,
    );
    return this.userRepository.create(user);
  }

  async updateUser(
    id: string,
    name: string,
    email: string,
    phoneNumber?: string,
    photoUrl?: string,
    image_base64?: string,
  ): Promise<User> {
    const user = User.create(
      id,
      name,
      email,
      phoneNumber,
      photoUrl,
      image_base64,
    );
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async deleteUserByEmail(email: string): Promise<void> {
    await this.userRepository.deleteByEmail(email);
  }
}
