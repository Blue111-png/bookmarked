export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  user?: User;
}

export interface Resource {
  id: string;
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
