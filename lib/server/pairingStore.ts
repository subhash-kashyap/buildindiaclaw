export type PairingStatus = "pending" | "connected" | "expired";

export type PairingSession = {
  id: string;
  code: string;
  status: PairingStatus;
  createdAt: string;
  expiresAt: string;
  command: string;
};

const pairingMap = new Map<string, PairingSession>();

function makeCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function createPairingSession() {
  const id = crypto.randomUUID();
  const code = makeCode();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);
  const command = `openclaw connect --relay https://clawfriends.xyz/relay --pair ${code}`;

  const session: PairingSession = {
    id,
    code,
    status: "pending",
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    command
  };

  pairingMap.set(id, session);
  return session;
}

export function getPairingSession(id: string) {
  const session = pairingMap.get(id);
  if (!session) return undefined;

  if (session.status === "pending" && new Date(session.expiresAt).getTime() < Date.now()) {
    const expired: PairingSession = { ...session, status: "expired" };
    pairingMap.set(id, expired);
    return expired;
  }

  return session;
}

export function confirmPairingSession(id: string) {
  const session = getPairingSession(id);
  if (!session || session.status !== "pending") return undefined;

  const connected: PairingSession = { ...session, status: "connected" };
  pairingMap.set(id, connected);
  return connected;
}
