const fakeAuth = (req,res,next) => {
  if (req.originalUrl === '/user/login/' && req.method === 'POST') {
    // Converts POST to GET
    req.method = 'GET';
  }
  next();
}

module.exports = fakeAuth;