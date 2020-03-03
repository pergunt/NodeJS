let i = 0;
module.exports = (req, res) => {
  i++;
  res.end('Hi' + ' ' + i.toString());
};