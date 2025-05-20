const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'Token not provided'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'Token is not valid'});
    }

    req.user = user;
    next();
  })
}

module.exports = {
  validateToken
}