export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber?: string,
    public readonly photoUrl?: string,
    public readonly image_base64?: string, // Novo campo
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    phoneNumber?: string,
    photoUrl?: string,
    image_base64?: string,
  ): User {
    return new User(id, name, email, phoneNumber, photoUrl, image_base64);
  }

  static fromDatabase(data: {
    id: string;
    name: string;
    email: string;
    phone_number?: string;
    photo_url?: string;
    image_base64?: string;
  }): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.phone_number,
      data.photo_url,
      data.image_base64,
    );
  }
}
