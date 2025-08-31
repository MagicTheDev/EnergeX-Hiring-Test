import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

export type ContextUser = { id: number } | null;

export function userFromAuthHeader(header?: string | null): ContextUser {
    if (!header) return null;
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (!m) return null;
    try {
        const decoded = jwt.verify(m[1], process.env.JWT_SECRET!) as JwtPayload;
        return decoded?.sub ? { id: Number(decoded.sub) } : null;
    } catch {
        return null;
    }
}