import { Project } from "../entities/Project";

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: number, project: Project): Promise<Project>;
  delete(id: number): Promise<void>;
  reorder(projectIds: number[]): Promise<void>;
}
