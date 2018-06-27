module.exports = function(error, res) {
	res.statusCode = 500;
	res.end(error.message || 'Server error');
}
