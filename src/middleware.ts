// @ts-ignore
export async function onRequest(context, next) {
  try {
    // ✅ FIX 1: Cloudflare dashboard ke variables ko global process me inject karna taake Astro/Keystatic crash na hon
    if (context.locals && context.locals.runtime && context.locals.runtime.env) {
      globalThis.process = globalThis.process || {};
      globalThis.process.env = {
        ...globalThis.process.env,
        ...context.locals.runtime.env,
      };
    }
    
    // ✅ FIX 2: Purana basic auth ka kachra mita kar request ko seedha Keystatic backend router ke hawale karna
    return await next();
    
  } catch (e) {
    return new Response('Internal Server Error\n' + (e instanceof Error ? e.stack : String(e)), { status: 500 });
  }
}
