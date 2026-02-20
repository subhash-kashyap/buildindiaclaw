import { NextResponse } from "next/server";
import { confirmPairingSession } from "@/lib/server/pairingStore";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = confirmPairingSession(params.id);
  if (!session) {
    return NextResponse.json({ error: "Unable to confirm pairing" }, { status: 400 });
  }
  return NextResponse.json(session);
}
