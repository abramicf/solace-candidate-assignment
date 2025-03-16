import db from "../../../db";
import { advocates } from "../../../db/schema";
import { desc, sql, ilike, or } from "drizzle-orm";
import { NextRequest } from "next/server";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const searchCondition = searchTerm ? 
    or(
      ilike(advocates.firstName, `%${searchTerm}%`),
      ilike(advocates.lastName, `%${searchTerm}%`),
      ilike(advocates.city, `%${searchTerm}%`),
      ilike(advocates.degree, `%${searchTerm}%`),
      sql`${advocates.yearsOfExperience}::text ILIKE ${`%${searchTerm}%`}`,
      // BACKEND QUERY BY SPECIALTIES GOES HERE
      // CHRIS TODO - How the json_array_elements_text drills down into the column visa-vis the schema will
      // return the text elements that we need to search on.  
      // sql`EXISTS (
      //   SELECT 1 FROM jsonb_array_elements_text(${advocates.specialties} -> 'payload') AS specialty
      //   WHERE specialty ILIKE ${`%${searchTerm}%`}
      // )`
      // BACKEND QUERY BY PHONE NUMBER GOES HERE
    ) : undefined;

  // Get total count for pagination info with search
  const [{ value: total }] = await db
    .select({ 
      value: sql<number>`count(*)::int`
    })
    .from(advocates)
    .where(searchCondition || sql`TRUE`);
  // Get paginated data with search
  const data = await db
    .select()
    .from(advocates)
    .where(searchCondition || sql`TRUE`)
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
