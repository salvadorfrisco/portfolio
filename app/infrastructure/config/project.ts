import { IProjectRepository } from "../../core/domain/repositories/IProjectRepository";
import { MySQLProjectRepository } from "../repositories/MySQLProjectRepository";

export const projectRepository: IProjectRepository =
  new MySQLProjectRepository();
