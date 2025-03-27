export class Project {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly technologies: string[],
  ) {}

  static create(
    title: string,
    description: string,
    imageUrl: string,
    technologies: string[],
  ): Project {
    return new Project(0, title, description, imageUrl, technologies);
  }

  static fromDatabase(data: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    technologies?: { name: string }[];
  }): Project {
    return new Project(
      data.id,
      data.title,
      data.description,
      data.image_url,
      data.technologies?.map((tech: { name: string }) => tech.name) || [],
    );
  }
}
