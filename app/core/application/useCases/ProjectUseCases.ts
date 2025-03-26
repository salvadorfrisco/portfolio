import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";

export class ProjectUseCases {
  constructor(private projectRepository: IProjectRepository) {}

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }

  async createProject(
    title: string,
    description: string,
    imageUrl: string,
    technologies: string[]
  ): Promise<Project> {
    const project = Project.create(title, description, imageUrl, technologies);
    return this.projectRepository.create(project);
  }

  async updateProject(
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    technologies: string[]
  ): Promise<Project> {
    const project = Project.create(title, description, imageUrl, technologies);
    return this.projectRepository.update(id, project);
  }

  async deleteProject(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
