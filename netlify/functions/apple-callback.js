// Riceve il POST di "Sign in with Apple" (response_mode=form_post) e rimanda
// l'utente all'app Android via intent:// scheme, così il plugin
// sign_in_with_apple può completare il login nativamente.
const querystring = require('querystring');

exports.handler = async (event) => {
  const params = querystring.parse(event.body || '');
  const forwarded = querystring.stringify(params);

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

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};
