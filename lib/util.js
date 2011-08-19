exports.length = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
exports.raiseError = function(msg) {
	console.log(msg);
}
exports.deletebyName = function (arrayName, name) {
	for (var index in arrayName) {
		if (arrayName[index] == name) {
			arrayName.splice(i, 1);
		}
	}
}
exports.deletebyIndex = function (arrayName, index) {
	arrayName.splice(index, 1);
}

