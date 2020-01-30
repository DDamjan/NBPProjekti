async function execFile(res, path) {
    try {
      res.sendFile(path);
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  }

  module.exports = {
      execFile: execFile
  }