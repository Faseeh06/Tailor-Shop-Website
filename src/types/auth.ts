export type UserRole = 'customer' | 'tailor' | 'admin';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}
