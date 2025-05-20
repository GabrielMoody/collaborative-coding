const onConnection = (ws, req, backend) => {
  const params = new URLSearchParams(req.url.split('?')[1]);
  const token = params.get('token');
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err);
    ws.close(4000, 'Invalid token');
    return;
  }

  const stream = new WebSocketJSONStream(ws);
  stream.agent = { connectSession: { userId: user.id } };
  backend.listen(stream);
}

module.exports = {
  onConnection,
}