import { collection } from "./database.js";

const tokenCache = new Map();
const TTL = 5 * 60 * 1000;

export async function AuthGuard(header, type) {
  const token = formatToken(header);
  if (!token) return false;

  const cached = tokenCache.get(token);
  if (cached && (Date.now() - cached.timestamp < TTL)) {
    return checkRole(cached.user, type);
  }

  const coll = collection('Auth');
  const user = await coll.findOne({ token }) || false;

  tokenCache.set(token, {
    user,
    timestamp: Date.now()
  });

  return checkRole(user, type);
}

function formatToken(header) {
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.split(' ')[1].trim();
}

function checkRole(user, type) {
  if (!user) return false;
  if (!type) return true;
  return user.role === type;
}
