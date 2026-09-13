// Serves bhop_brick at yvlyang.com/bhop/.
// The game lives in its own repo (github.com/yvlyang/bhop_brick) and Cloudflare Pages project;
// this forwards /bhop/* to that project so visitors never leave yvlyang.com.
const GAME_ORIGIN = 'https://bhop-brick.pages.dev';

export async function onRequest({ request }) {
  const url = new URL(request.url);
  if (url.pathname === '/bhop') return Response.redirect(`${url.origin}/bhop/${url.search}`, 301); // relative URLs need the slash

  const target = new URL(url.pathname.replace(/^\/bhop/, '') + url.search, GAME_ORIGIN);
  const upstream = await fetch(new Request(target, request), { redirect: 'manual' });
  const response = new Response(upstream.body, upstream);

  // keep redirects from the game project (e.g. /index.html -> /) inside /bhop/
  const location = response.headers.get('location');
  if (location) {
    const loc = new URL(location, GAME_ORIGIN);
    if (loc.origin === GAME_ORIGIN) response.headers.set('location', '/bhop' + loc.pathname + loc.search);
  }
  return response;
}
