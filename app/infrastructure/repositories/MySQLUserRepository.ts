import mysql from "mysql2/promise";
import { IUserRepository } from "../../core/domain/repositories/IUserRepository";
import { User } from "../../core/domain/entities/User";

export class MySQLUserRepository implements IUserRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
      database: process.env.MYSQL_SCHEMA,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      multipleStatements: true,
      supportBigNumbers: true,
      bigNumberStrings: false,
      dateStrings: true,
      typeCast: true,
      connectTimeout: 15000,
    });
  }

  async findAll(): Promise<User[]> {
    const [rows] = await this.pool.execute(`SELECT * FROM users`);
    return (rows as Record<string, unknown>[]).map((row) =>
      User.fromDatabase(row as unknown as User),
    );
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute(`SELECT * FROM users WHERE id = ?`, [
      id,
    ]);
    const row = (rows as Record<string, unknown>[])[0];
    return row ? User.fromDatabase(row as unknown as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );
    const row = (rows as Record<string, unknown>[])[0];
    return row ? User.fromDatabase(row as unknown as User) : null;
  }

  async create(user: User): Promise<User> {
    await this.pool.execute(
      `INSERT INTO users (id, name, email, phone_number, photo_url) VALUES (?, ?, ?, ?, ?)`,
      [
        user.id,
        user.name,
        user.email,
        user.phoneNumber || null,
        user.photoUrl || null,
      ],
    );
    return user;
  }

  async update(id: string, user: User): Promise<User> {
    await this.pool.execute(
      `UPDATE users SET name = ?, email = ?, phone_number = ?, photo_url = ? WHERE id = ?`,
      [
        user.name,
        user.email,
        user.phoneNumber || null,
        user.photoUrl || null,
        id,
      ],
    );
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.pool.execute(`DELETE FROM users WHERE email = ?`, [email]);
  }
}
