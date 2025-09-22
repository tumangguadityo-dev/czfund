export const config = { runtime: 'edge' };

export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    let target = searchParams.get('url');
    if (!target) return new Response('Missing url', { status: 400 });
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;

    const res = await fetch(target, {
      headers: {
        // mimic a real browser
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml'
      }
    });

    const text = await res.text();
    return new Response(text, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'access-control-allow-origin': '*',
        'cache-control': 's-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (e) {
    return new Response('Proxy error: ' + e.message, { status: 500 });
  }
};
