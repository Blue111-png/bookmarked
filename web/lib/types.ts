export interface User {
  _id: string;
  email: string;
  displayName: string;
}

export interface Reaction {
  _id: string;
  emoji: string;
  user?: User;
}

export interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
  submittedBy?: User;
  reactions: Reaction[];
}

export interface AuthState {
  token: string;
  user: User;
}
