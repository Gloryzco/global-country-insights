import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as argon from 'argon2';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toPayload(): Partial<User> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  async verifyPassword(userPassword: string, password: string) {
    const isValidPassword = await argon.verify(password, userPassword);
    return isValidPassword;
  }
}
