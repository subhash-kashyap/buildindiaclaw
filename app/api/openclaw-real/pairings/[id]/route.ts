import { NextResponse } from "next/server";
import { getPairingSession } from "@/lib/server/pairingStore";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = getPairingSession(params.id);
  if (!session) {
    return NextResponse.json({ error: "Pairing session not found" }, { status: 404 });
  }
  return NextResponse.json(session);
}
