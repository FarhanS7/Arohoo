import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  userId: string; // Including both as we sometimes use userId in JWT payload
  role: Role;
  merchantId?: string | null;
}

export interface TenantContext {
  merchantId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tenant?: TenantContext | null;
    }
  }
}
