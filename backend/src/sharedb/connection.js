const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const jwt = require('jsonwebtoken');

const {FileMeta} = require('../model/FileMetaData');
const {backend} = require('../config/sharedb');

require('dotenv').config();

backend.use('readSnapshots', async (req, callback) => {
  try {
    const { snapshots } = req;
    const userId = req.agent.stream.agent.connectSession.userId; 

    if(!userId) {
      return callback(new Error('Unauthorized'));
    }

    const fileMeta = await FileMeta.findOne({ _id: snapshots[0].id });
    if (!fileMeta) {
      return callback(new Error('File not found'));
    }

    const project = await FileMeta.findOne({ _id: fileMeta.projectId });

    // Check if the user is the owner or a collaborator
    if (project.ownerID.toString() !== userId &&
        !project.collaborators.some(collaborator => collaborator.userId === userId)) {
      return callback(new Error('Unauthorized'));
    }

    return callback(null, snapshots);
  } catch (error) {
    console.error('Error in readSnapshots middleware:', error);
    return callback(new Error('Unauthorized'));
  }
});


module.exports = function setupShareDBWebSocket(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (ws, req) => {
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
  });

  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};