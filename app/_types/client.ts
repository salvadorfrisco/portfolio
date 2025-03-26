export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  comment_last: string;
  active: boolean;
  user_type: string;
  updated_at?: Date;
  created_at: Date;
  rating: number;
  lead: number;
  building_id: number;
};

export type CommentHistory = {
  id: string;
  client_id: string;
  comment: string;
  created_at: Date;
};

export type CreateClientDTO = Omit<
  Client,
  "id" | "created_at" | "updated_at" | "active" | "user_type"
>;

export interface ClientFormData {
  name: string;
  phone: string;
  email: string;
  comment_last: string;
  rating: number;
  lead: number;
  building_id: number;
}
