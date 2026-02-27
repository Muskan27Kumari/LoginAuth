export type User = {
  email: string;
  name: string;
  id: string;
};

export type Payload = {
  token: string;
  setting: string;
  settings?: string[];
  roles: string[];
  user: User;
};
