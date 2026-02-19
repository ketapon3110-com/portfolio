export default async (request, context) => {
  const user = process.env.BASIC_USER || "";
  const pass = process.env.BASIC_PASS || "";
  const expected = "Basic " + btoa(`${user}:${pass}`);

  const auth = request.headers.get("authorization") || "";

  if (!user || !pass) {
    return new Response("Auth is not configured.", { status: 500 });
  }

  if (auth !== expected) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Portfolio"' },
    });
  }

  return context.next();
};
