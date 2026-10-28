export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/apple-callback") {
      return appleCallback(request, url);
    }
    if (url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }
    return env.ASSETS.fetch(request);
  },
};

// Riceve il POST di "Sign in with Apple" (response_mode=form_post) dall'app
// Android e rimanda l'utente all'app via intent:// scheme, così il plugin
// sign_in_with_apple completa il login nativamente. Era una Netlify Function
// (coastly-web, d58b614), persa nella migrazione a Workers del 14/09/2026.
async function appleCallback(request, url) {
  const params = request.method === "POST"
    ? new URLSearchParams(await request.text())
    : url.searchParams;
  const forwarded = params.toString();
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Coastly</title></head>
<body>
  <script>
    window.location.href = "intent://callback?${forwarded}#Intent;package=com.antoniotota.coastly;scheme=signinwithapple;end";
  </script>
  <p>Accesso in corso… se non vieni reindirizzato automaticamente, torna all'app Coastly.</p>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
