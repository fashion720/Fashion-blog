export async function onRequest(context, next) {
  try {
    const { request } = context;
    try { console.log('Keystatic auth present:', !!process.env.ADMIN_USER, !!process.env.ADMIN_PASS); } catch {}
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/keystatic')) return await next();

    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;
    if (!user || !pass) return await next(); // no creds set => allow access

    const authHeader = request.headers.get('authorization') || '';
    const encode = (s) =>
      typeof Buffer !== 'undefined'
        ? Buffer.from(s).toString('base64')
        : typeof btoa !== 'undefined'
        ? btoa(s)
        : '';
    const expected = 'Basic ' + encode(`${user}:${pass}`);
    if (authHeader === expected) return await next();

    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Keystatic Admin"' },
    });
  } catch (e) {
    try {
      console.error('Keystatic middleware error:', e && e.stack ? e.stack : e);
    } catch {}
    const body = (e && e.stack) || String(e);
    return new Response('Internal Server Error\n' + body, { status: 500 });
  }
}

export {}; // ensure this is treated as a module
