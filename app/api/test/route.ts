// Dead simple test route — no imports, no dependencies
// If this returns 401 the problem is in Next.js config
// If this returns 200 the problem is in our webhook imports

export async function GET() {
  return Response.json({ message: "hello world" });
}
