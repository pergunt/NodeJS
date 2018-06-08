let i = 0;
module.exports = function(req, res) {
	i++;
	 res.end(JSON.stringify(i))
};