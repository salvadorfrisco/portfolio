import mysql from "mysql2/promise";
import { IProjectRepository } from "../../core/domain/repositories/IProjectRepository";
import { Project } from "../../core/domain/entities/Project";

export class MySQLProjectRepository implements IProjectRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
      database: process.env.MYSQL_SCHEMA,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      waitForConnections: true,
      connectionLimit: 20, // Ajuste conforme necessário
      queueLimit: 0,
      multipleStatements: true, // Permite múltiplas declarações SQL
      supportBigNumbers: true,
      bigNumberStrings: false,
      dateStrings: true,
      typeCast: true,
      connectTimeout: 15000,
    });
  }

  /*
  export default async function executeQuery({ query, values }) {
    try {
      const [results] = await pool.execute(query, values);
      return results;
    } catch (error) {
      console.error("Database query error:", error);
      throw error; // Propaga o erro em vez de retornar { error }
    }
  }
  */

  async findAll(): Promise<Project[]> {
    const [rows] = await this.pool.execute(`
      SELECT p.*, GROUP_CONCAT(t.name) as technologies
      FROM projects p
      LEFT JOIN technologies t ON p.id = t.project_id
      GROUP BY p.id
    `);

    type ProjectRow = {
      id: number;
      title: string;
      description: string;
      image_url: string;
      technologies: string | null;
    };

    return (rows as ProjectRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      technologies: row.technologies ? row.technologies.split(",") : [],
    }));
  }

  async findById(id: number): Promise<Project | null> {
    const [rows] = await this.pool.execute(
      `
      SELECT p.*, GROUP_CONCAT(t.name) as technologies
      FROM projects p
      LEFT JOIN technologies t ON p.id = t.project_id
      WHERE p.id = ?
      GROUP BY p.id
    `,
      [id],
    );

    const row = (
      rows as {
        id: number;
        title: string;
        description: string;
        image_url: string;
        technologies: string | null;
      }[]
    )[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      technologies: row.technologies ? row.technologies.split(",") : [],
    };
  }

  async create(project: Project): Promise<Project> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        "INSERT INTO projects (title, description, image_url) VALUES (?, ?, ?)",
        [project.title, project.description, project.imageUrl],
      );

      type InsertResult = { insertId: number };
      const projectId = (result as InsertResult).insertId;

      if (project.technologies.length > 0) {
        const values = project.technologies.map((name) => [projectId, name]);
        await connection.query(
          "INSERT INTO technologies (project_id, name) VALUES ?",
          [values],
        );
      }

      await connection.commit();

      return {
        id: projectId,
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        technologies: project.technologies,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id: number, project: Project): Promise<Project> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        "UPDATE projects SET title = ?, description = ?, image_url = ? WHERE id = ?",
        [project.title, project.description, project.imageUrl, id],
      );

      await connection.execute(
        "DELETE FROM technologies WHERE project_id = ?",
        [id],
      );

      if (project.technologies.length > 0) {
        const values = project.technologies.map((name) => [id, name]);
        await connection.query(
          "INSERT INTO technologies (project_id, name) VALUES ?",
          [values],
        );
      }

      await connection.commit();

      return {
        id,
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        technologies: project.technologies,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        "DELETE FROM technologies WHERE project_id = ?",
        [id],
      );
      await connection.execute("DELETE FROM projects WHERE id = ?", [id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
