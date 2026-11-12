export async function onRequestGet(context) {
  if (!context.env.JUJUAN_KV) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
  const data = await context.env.JUJUAN_KV.get('trip_state');
  return new Response(data || JSON.stringify(null), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  if (!context.env.JUJUAN_KV) {
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
  const body = await context.request.text();
  await context.env.JUJUAN_KV.put('trip_state', body);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
