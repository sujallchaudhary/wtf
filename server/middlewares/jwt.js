const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({ error: 'No token provided!' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }
    req.body._id = decoded.userId;
    next();
  });
};

const verifyTokenFun=(token)=>{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if(decoded){
    return true;
  }
  return false;
}
module.exports = { verifyToken,verifyTokenFun };