import db from "../../../db";
import { advocates } from "../../../db/schema";
import { desc, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Get total count for pagination info
  const [{ value: total }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(advocates);
  
  // Get paginated data
  const data = await db
    .select()
    .from(advocates)
    .orderBy(desc(advocates.id))
    .limit(limit)
    .offset(offset);

  return Response.json({ 
    data,
    pagination: {
      total,
      limit,
      offset
    }
  });
}
