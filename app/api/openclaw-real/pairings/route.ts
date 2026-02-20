import { NextResponse } from "next/server";
import { createPairingSession } from "@/lib/server/pairingStore";

export async function POST() {
  const session = createPairingSession();
  return NextResponse.json(session);
}
