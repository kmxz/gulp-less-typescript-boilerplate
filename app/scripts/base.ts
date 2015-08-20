// module for array/dictionary operations

module Base {

  // convert an array-like object to an array
  export var array = function (arrayLike: {length: number}): Array<any> {
    return Array.prototype.slice.call(arrayLike);
  };

  // forEach for a dictionary, using a callback taking the value and the key as parameters
  export var forEach = function<T> (object: {[key: string]: T}, callback: (T, string) => void): void {
    Object.keys(object).forEach(function (key: string) {
      callback(object[key], key);
    });
  };

  // map for a dictionary, using a callback taking the value and the key as parameters
  export var map = function<T, S> (object: {[key: string]: T}, callback: (T, string) => S): {[key: string]: S} {
    var returnVal:{[key: string]: S} = {};
    Object.keys(object).forEach(function (key: string) {
      returnVal[key] = callback(object[key], key);
    });
    return returnVal;
  };

}
