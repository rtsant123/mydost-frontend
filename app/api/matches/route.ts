import { NextResponse } from "next/server";
import { matchList } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(matchList);
}
