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
exports.deletebyProto = function (arrayName, name) {
	for (var index in arrayName) {
		if (arrayName[index].proto === name.proto) {
			delete arrayName[index];
		}
	}
}
exports.deletebyIndex = function (arrayName, index) {
	delete arrayName[index];
}
exports.shiftbyName = function (arrayName, name) {
  for (var index in arrayName) {
    if (arrayName[index] === name) {
      arrayName.splice(i, 1);
    }
  }
}
exports.shiftbyProto = function (arrayName, name) {
  for (var index in arrayName) {
    if (arrayName[index].proto === name.proto) {
      arrayName.splice(i, 1);
    }
  }

}
exports.shiftbyIndex = function (arrayName, index) {
  arrayName.splice(index, 1);
}
exports.push = function (arrayName, obj) {
	for (var i=0;;i++) {
		if (!arrayName.hasOwnProperty(i)) {
			arrayName[i] = obj;
			return true;
		}
	}
	return false;
}

exports.cloneExcept = function(o, e){
	if(typeof e == "string"){
		var t = o.clone();
		delete t[e];
		return t;
	}
}

exports.findCardById = function (cards, id) {
	for (var i in cards){
		if(cards[i].id == id)
			return cards[i];
	}
	return null;
}
