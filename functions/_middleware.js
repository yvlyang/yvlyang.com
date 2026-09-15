// Keep shared Discord links as plain links instead of rich preview cards.
export function onRequest({ request, next }) {
  const agent = request.headers.get('user-agent') || '';
  if ((request.method === 'GET' || request.method === 'HEAD') && /Discordbot/i.test(agent)) {
    return new Response(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store', Vary: 'User-Agent' },
    });
  }
  return next();
}
