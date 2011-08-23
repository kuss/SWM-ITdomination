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
		if (arrayName[index] === name) {
			delete arrayName[index];
		}
	}
}
exports.deletebyIndex = function (arrayName, index) {
	delete arrayName[index];
}
exports.push = function (arrayName, obj) {
	for (var i in arrayName) {
		if (!arrayName.hasOwnPropert(i)) {
			arrayName[i] = obj;
			return true;
		}
	}
	arrayName.push(obj);
}

exports.cloneExcept = function(o, e){
	if(typeof e == "string"){
		var t = o.clone();
		delete t[e];
		return t;
	}
}
