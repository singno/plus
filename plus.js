/*
 * Plus.js 1.0.1
 * https://github.com/singno/plus/
 *
 * Copyright 2014, singno
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by jashkenas's JavaScript library underscore:
 * https://github.com/jashkenas/underscore
 */
;(function (root, undefined) { // `root == window` in the browser, `root == exports` on the server. 
	'use strict';

	// Save the old `_`
	var old_ = root._;

	// Define the breaker in order to break the `each` iterate internal.
	var breaker = {};

	var ArrayProp = Array.prototype,
		ObjProp = Object.prototype,
		FuncProp = Function.prototype,
		StrProp = String.prototype;

	var slice = ArrayProp.slice,
		concat = ArrayProp.concat,
		push = ArrayProp.push,
		splice = ArrayProp.splice,
		toString = ObjProp.toString,
		hasOwn = ObjProp.hasOwnProperty,
		strIndexOf = StrProp.indexOf,
		strLastIndexOf = StrProp.lastIndexOf;

	// New API of `ECMAScript 5`.
	var	nativeIsArray = Array.isArray,
		nativeForEach = ArrayProp.forEach,
		nativeMap = ArrayProp.map,
		nativeFilter = ArrayProp.filter,
		nativeEvery = ArrayProp.every,
		nativeSome = ArrayProp.some,
		nativeIndexOf = ArrayProp.indexOf,
		nativeLastIndexOf = ArrayProp.lastIndexOf,
		nativeReduce = ArrayProp.reduce,
		nativeReduceRight = ArrayProp.reduceRight,
		nativeKeys = Object.keys,
		nativeCreate = Object.create,
		nativeBind = FuncProp.bind;
		
	var rdot = /([^.]+)\.?/,
		rquery = /\?([^#]*)/,
		rhash = /#.*/;

	var _ = function (obj) {
		if (!(this instanceof _)) {
			return new _(obj);
		}

		this._obj = obj;
		this._chain = false;
	};

	_.VERSION = '1.0.1';

	// Collections Methods
	// -------------------

	_.each = function (obj, iterator, context) {
		if (obj == null) {
			return obj;
		}

		if (obj.forEach && obj.forEach === nativeForEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, len = obj.length; i < len; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker) {
					return ;
				}
			}
		} else {
			var keys = _.keys(obj);
			for (var i = 0, len = keys.length; i < len; i++) {
				if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) {
					return ;
				}
			}
		}
	};

	_.map = function (obj, iterator, context) {
		var result = [];

		if (obj == null) {
			return result;
		}

		if (obj.map && obj.map === nativeMap) {
			return obj.map(iterator, context);
		}

		_.each(obj, function (val, idx, list) {
			result.push(iterator.call(context, val, idx, list));
		});

		return result;
	};

	_.pluck = function (obj, key) {
		return _.map(obj, _.property(key));
	};

	_.find = function (obj, predicate, context) {
		var result;
		_.some(obj, function (val, idx, list) {
			if (predicate.call(context, val, idx, list)) {
				result = val;
				return true;
			}
		});
		return result;
	};

	_.filter = _.grep = function (obj, predicate, context) {
		var result = [];

		if (obj == null) {
			return result;
		}

		if (obj.filter && obj.filter === nativeFilter) {
			return obj.filter(predicate, context);
		}

		_.each(obj, function (val, idx, list) {
			if (predicate.call(context, val, idx, list)) {
				result.push(val);
			}
		});

		return result;
	};

	_.reject = function (obj, predicate, context) {
		return _.filter(obj, _.negate(predicate), context);
	};

	_.where = function (obj, attrs) {
		return _.filter(obj, _.matches(attrs));
	};

	_.findWhere = function (obj, attrs) {
		return _.find(obj, _.matches(attrs));
	};

	_.every = function (obj, predicate, context) {
		var result = true;

		if (obj == null) {
			return result;
		}

		if (obj.every && obj.every === nativeEvery) {
			return obj.every(predicate, context);
		}

		_.each(obj, function (val, idx, list) {
			if (!predicate.call(context, val, idx, list)) {
				result = false;
				return breaker;
			}
		});

		return result;
	};

	_.some = _.any = function (obj, predicate, context) {
		var result = false;

		if (obj == null) {
			return result;
		}

		if (obj.some && obj.some === nativeSome) {
			return obj.some(predicate, context);
		}

		_.each(obj, function (val, idx, list) {
			if (predicate.call(context, val, idx, list)) {
				result = true;
				return breaker;
			}
		});

		return result;
	};

	_.contains = function (obj, target) {
		if (obj == null) {
			return false;
		}

		if (obj.indexOf && obj.indexOf === nativeIndexOf) {
			return obj.indexOf(target) > -1;
		}

		return _.some(obj, function (val) {
			return val === target;
		});
	};

	_.size = function (obj) {
		if (obj == null) {
			return 0;
		}

		return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	};

	_.toArray = function (obj) {
		if (obj == null) {
			return [];
		}

		if (_.isArray(obj)) {
			return slice.call(obj);
		} 

		if (obj.length === +obj.length) {
			return _.map(obj, _.identity);
		}	

		return _.values(obj);
	};

	_.max = function (obj, iterator, context) {
		if (_.isArray(obj) && !iterator) {
			return Math.max.apply(Math, obj);
		}

		var result = -Infinity,
			lastComputed = -Infinity,
			computed;

		_.each(obj, function (val, key, list) {
			computed = iterator ? iterator.call(context, val, key, list) : val;
			if (lastComputed < computed) {
				result = val;
				lastComputed = computed;
			} 
		});

		return result;
	};

	_.min = function (obj, iterator, context) {
		if (_.isArray(obj) && !iterator) {
			return Math.min.apply(Math, obj);
		}

		var result = Infinity,
			lastComputed = Infinity,
			computed;

		_.each(obj, function (val, key, list) {
			computed = iterator ? iterator.call(context, val, key, list) : val;
			if (lastComputed > computed) {
				result = val;
				lastComputed = computed;
			} 
		});

		return result;
	};

	function lookupIterator (value) {
		if (value == null) {
			return _.identity;
		}

		if (_.isFunction(value)) {
			return value;
		} 

		return _.property(value);
	}

	_.sortBy = function (obj, iterator, context) {
		iterator = lookupIterator(iterator);
		return _.pluck(_.map(obj, function (val, idx, list) {
			return {
				value: val,
				index: idx, 
				compare: iterator.call(context, val, idx, list)
			};
		}).sort(function (left, right) {
			var val = left.compare - right.compare;
			return val ? val : (left.index - right.index);
		}), 'value');
	};

	function group (func) {
		return function (obj, iterator, context) {
			var result = {};
			iterator = lookupIterator(iterator);
			_.each(obj, function (val, idx, list) {
				var key = iterator.call(context, val, idx, list);
				func(result, key, val);
			});
			return result;
		};
	}

	_.groupBy = group(function (result, key, val) {
		_.has(result, key) ? result[key].push(val) : result[key] = [val];
	});

	_.indexBy = group(function (result, key, val) {
		result[key] = val;
	});

	_.countBy = group(function (result, key) {
		_.has(result, key) ? result[key]++ : result[key] = 1;
	});

	_.shuffle = function (obj) {
		if (obj == null) {
			return [];
		}

		if (_.isArray(obj)) {
			return obj.slice(0).sort(function () {
				return Math.random() - 0.5;
			});
		} else {
			return _.shuffle(_.keys(obj));
		}
	};

	_.sample = function (obj, n) {
		if (n == null) {
			if (obj.length !== +obj.length) {
				obj = _.values(obj);
			}

			return obj[_.random(obj.length - 1)];
		}

		return _.shuffle(obj).slice(0, Math.max(0, n));
	};

	_.partition = function (obj, predicate, context) {
		predicate = lookupIterator(predicate);
		var pass = [],
			fail = [];

		_.each(obj, function (val, idx, list) {
			(predicate.call(context, val, idx, list) ? pass : fail).push(val); 
		});

		return [pass, fail];
	};

	// Array Methods
	// -------------
	
	_.reduce = function (obj, iterator, initialValue, context) {
		if (obj == null) {
			return ;
		}

		var memo = initialValue,
			initial = arguments.length > 2;

		if (obj.reduce && obj.reduce === nativeReduce) {
			if (context) {
				iterator = _.proxy(iterator, context);
			}

			return initial ? obj.reduce(iterator, initialValue) : obj.reduce(iterator);
		}

		_.each(obj, function (val, idx, list) {
			if (!initial) {
				memo = val;
				initial = true;
			} else {
				memo = iterator.call(context, memo, val, idx, list);
			}
		});

		return memo;
	};

	_.reduceRight = function (obj, iterator, initialValue, context) {
		if (obj == null) {
			return ;
		}

		var memo = initialValue,
			initial = arguments.length > 2;

		if (obj.reduceRight && obj.reduceRight === nativeReduceRight) {
			if (context) {
				iterator = _.proxy(iterator, context);
			}

			return initial ? obj.reduceRight(iterator, initialValue) : obj.reduceRight(iterator);
		}
		
		var keys,
			last = obj.length - 1;
		
		if (last !== +last) {
			keys = _.keys(obj);
			last = keys.length - 1;
		}

		_.each(obj, function (val, idx) {
			var index = keys ? keys[last--] : last--;
			if (!initial) {
				memo = obj[index];
				initial = true;
			} else {
				memo = iterator.call(context, memo, obj[index], index, obj);
			}
		});

		return memo;
	}; 
	
	_.first = function (array, n) {
		if (array == null) {
			return undefined;
		}

		if (n == null) {
			return array[0];
		}

		if (n <= 0) {
			return [];
		}

		return slice.call(array, 0, n);
	}; 

	_.last = function (array, n) {
		if (array == null) {
			return undefined;
		}

		if (n == null) {
			return array[array.length - 1];
		}

		return slice.call(array, Math.max(0, array.length - n));
	};	
	
	_.indexOf = function (obj, target, offset) {
		if (obj == null) {
			return -1;
		}

		offset = +offset || 0;

		if (obj.indexOf && (obj.indexOf === strIndexOf || obj.indexOf === nativeIndexOf)) {
			return obj.indexOf(target, offset);
		}

		if (offset < 0) {
			offset = offset + obj.length;
		}

		for (var i = offset, len = obj.length; i < len; i++) {
			if (obj[i] === target) {
				return i;
			}
		}

		return -1;
	};

	_.lastIndexOf = function (obj, target, offset) {
		if (obj == null) {
			return -1;
		}

		offset = +offset || obj.length - 1;

		if (obj.lastIndexOf && (obj.lastIndexOf === strLastIndexOf || obj.lastIndexOf === nativeLastIndexOf)) {
			return obj.lastIndexOf(target, offset);
		}

		if (offset < 0) {
			offset = offset + obj.length;
		}

		for (var i = offset; i > 0; i--) {
			if (obj[i] === target) {
				return i;
			}
		}

		return -1;
	};

	_.range = function (start, stop, step) {
		if (arguments.length <= 1) {
			return [];
		}
		
		start = +start;
		stop = +stop;
		step = +arguments[2] || 1;

		var range = [],
			idx = 0;

		while (start < stop) {
			range[idx++] = start;
			start += step;
		}

		return range;
	};

	_.uniq = _.unique = function (array, iterator, context) {
		if (array == null) {
			return [];
		}

		var result = [],
			seen = {},
			value;

		for (var i = 0, len = array.length; i < len; i++) {
			value = array[i];
			if (iterator) {
				value = iterator.call(context, value, i, array);
			}
			if (!_.has(seen, value)) {
				result.push(array[i]);
				seen[value] = true;	
			}
		}

		return result;
	};

	_.object = function (list, values) {
		if (list == null) {
			return {};
		}

		var result = {};

		for (var i = 0, len = list.length; i < len; i++) {
			if (values) {
				result[list[i]] = values[i];
			} else {
				result[list[i][0]] = list[i][1];
			}
		}

		return result;
	};

	_.compact= function (array) {
		return _.filter(array, _.identity);
	};

	function flatten (input, shallow, output) {
		output = output || [];

		if (shallow && _.every(input, _.isArray)) {
			return concat.apply(output, input);
		}

		for (var i = 0, len = input.length; i < len; i++) {
			var value = input[i];
			if (shallow || !value.length) {
				push.call(output, value);
			} else {
				flatten(value, shallow, output);
			}
		}

		return output;
	};

	_.flatten = function (array, shallow) {
		return flatten(array, shallow);
	};

	_.without = function (array) {
		var rest = flatten(slice.call(arguments, 1), true);
		return _.filter(array, function (val, key) {
			return !_.contains(rest, val);
		});
	};

	_.union = function () {
		return _.uniq(flatten(arguments, true));
	};

	_.intersection = function (array) {
		var rest = slice.call(arguments, 1);
		return _.filter(_.uniq(array), function (val) {
			return _.every(rest, function (other) {
				return _.contains(other, val);
			});
		});
	};

	_.insert = function (array, idx) {
		if (array == null) {
			return [];
		}

		var argv = [idx, 0].concat(slice.call(arguments, 2));
		splice.apply(array, argv);

		return array;
	};

	// Function Methods
	// ----------------
	
	_.after = function (times, func) {
		return function () {
			if (--times < 1) {
				return func.apply(this, arguments);
			}
		};
	};

	// Run a function N times
	_.times = function (n, iterator, context) {
		var result = [];

		for (var i = 0; i < n; i++) {
			result.push(iterator.call(context, i));
		}

		return result;
	};

	// Returns a function that will only be ran one time, no matter how many times it been call
	_.once = function (func) {
		var ran = false,
			result;

		return function () {
			if (ran) {
				return result;
			}

			ran = true;
			result = func.apply(this, arguments);
			func = null;
			return result;
		};
	};

	_.throttle = function (func, wait) {
		var timer;

		return function () {
			var self = this,
				argv = slice.call(arguments);

			clearTimeout(timer);
			timer = setTimeout(function () {
				func.apply(self, argv);
			}, wait);
		};
	};

	_.debounce = function (func, wait) {
		var prevCallTime = 0;

		return function () {
			var now = _.now();

			if (now - wait > prevCallTime) {
				prevCallTime = now;
				return func.apply(this, arguments);
			} 
		};
	};

	_.bind = _.proxy = function (func, context) {
		var argv = slice.call(arguments, 2),
			name;

		if (_.isFunction((func))) {
			// skip 
		} else if (_.isObject(func)) {
			name = context;
			context = func;
			func = context[name];
		}

		if (func.bind && func.bind === nativeBind) {
			return nativeBind.apply(func, [context].concat(argv));
		}

		return function () {
			func.apply(context, argv.concat(slice.call(arguments)));
		};
	};

	_.partial = function (func) {
		var outerArgv = slice.call(arguments, 1);

		return function () {
			var argv = slice.call(outerArgv),
				len = arguments.length,
				i = 0,
				j = 0;

			while(j < len) {
				if (argv[i] === undefined) {
					argv[i] = arguments[j];
					j++;
				}

				i++;
			}

			return func.apply(this, argv);
		};
	};

	_.wrap = function (func, wrapper) {
		return _.partial(wrapper, func);
	};

	_.memoize = function (func, hasher) {
		var memo = {},
			hasher = hasher || _.identity;

		return function () {
			var key = hasher.apply(this, arguments);

			return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments); 
		};
	};

	_.delay = function (func, wait) {
		var argv = slice.call(arguments, 2);
		setTimeout(function () {
			func.apply(null, argv);
		}, wait);
	};

	_.defer = function (func) {
		return _.delay.apply(_, [func, 0].concat(slice.call(arguments, 1)));
	};

	// Object Methods
	// --------------
	
	// The same as jQuery.extend, _.extend will inherit prototype attributes
	_.extend = function () {
		var target = arguments[0],
			deep = false,
			objs = slice.call(arguments, 1);

		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1];
			objs.shift();
		}

		_.each(objs, function (obj) {
			var val;

			for (var key in obj) {
				val = obj[key];
				if (deep && _.isObject(val)) {
					_.extend(deep, target[key] = _.isArray(val) ? [] : {}, val);	
				} else {
					target[key] = val;	
				}
			}
		});	

		return target;
	};

	_.has = function (obj, key) {
		return hasOwn.call(obj, key);
	};

	_.keys = function (obj) {
		if (!_.isObject(obj)) {
			return [];
		}

		if (nativeKeys) {
			return nativeKeys(obj);
		}

		var keys = [];

		for (var key in obj) {
			if (_.has(obj, key)) {
				keys.push(key);
			}
		}

		return keys;
	};

	_.values = function (obj) {
		var values = [];

		_.each(obj, function (val) {
			values.push(val);
		});

		return values;
	};

	_.result = function (obj, name) {
		if (obj == null) {
			return undefined;
		}

		if (_.isFunction(obj[name])) {
			return obj[name]();
		}

		while (rdot.test(name)) {
			obj = obj[RegExp.$1];
			
			if (obj == null) {
				return undefined;
			}

			name = name.replace(rdot, '');
		}

		return obj;
	}; 

	_.invert = function (obj) {
		var result = {};
		_.each(obj, function (val, key) {
			result[val] = key;
		});
		return result;
	};

	_.pairs = function (obj) {
		var result = [];
		_.each(obj, function (val, key) {
			result.push([key, val]);
		});
		return result;
	};

	// Return a sorted list of available function names in an object 
	// This function will iterate prototype attributes
	_.functions = function (obj) {
		var names = [];
		for (var key in obj) {
			if (_.isFunction(obj[key])) {
				names.push(key);
			}
		}
		return names.sort();
	};

	var F = function () {};
	_.create = function (obj) {
		if (!_.isObject(obj)) {
			return {};
		}

		if (nativeCreate) {
			return nativeCreate(obj);
		}

		F.prototype = obj;
		return new F();
	};

	_.pick = function (obj, iterator, context) {
		var result = {};

		if (_.isFunction(iterator))	{
			_.each(obj, function (value, key) {
				if (iterator.call(context, value, key, obj)) {
					result[key] = value;
				}
			});
		} else {
			var argv = slice.call(arguments, 1);

			_.each(argv, function (value) {
				if (_.has(obj, value)) {
					result[value] = obj[value];
				}
			});
		}

		return result;
	};

	_.omit = function (obj, iterator, context) {
		var result = {};

		if (_.isFunction(iterator)) {
			return _.pick(obj, _.negate(iterator), context);
		} else {
			var hash = _.invert(slice.call(arguments, 1));
			_.each(obj, function (value, key) {
				if (!_.has(hash, key)) {
					result[key] = value;
				}
			});
		}

		return result;
	};

	_.isEqual = function (a, b) {
		if (a === b) {
			// `0` is not equal to `-0`, but `0 === -0` is true
			// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal). 
			return a !== 0 || 1 / a === 1 / b; 
		}

		if (a instanceof _) {
			a = a._obj;
		}

		if (b instanceof _) {
			b = b._obj;
		}

		var type = _.type(a);

		if (type !== _.type(b)) {
			return false;
		}

		switch (type) {
			case 'string':
			case 'regexp':
				// 'a' is equal to new String('a')
				// Regular expressions transform to string, String(/a/gim) === String(/a/gim)
				return String(a) === String(b);
			case 'number':
				a = +a;
				b = +b;
				// NaN !== NaN, but they are equivalent
				if (a !== a) {
					return b !== b;
				}

				return a === 0 ? 1 / a === 1 / b  : a === b; 
			case 'date':
			case 'boolean':
				// Date compare their timestamp, boolean transform to numeric
				return +a === +b;
		}

		if (typeof a !== 'object' || typeof b !== 'object') {
			return false;
		}

		if (a.constructor !== b.constructor) {
			return false;
		}

		if (type === 'array') {
			if (a.length === b.length) {
				return _.every(a, function (val, idx) {
					return _.isEqual(val, b[idx]);
				});
			} else {
				return false;
			}
		} 

		var keys = _.keys(a);

		if (keys.length !== _.keys(b).length) {
			return false;
		}

		return _.every(a, function (val, key) {
			return _.isEqual(val, b[key]);
		});
	};

	// _.defaults will iterate prototype attributes
	_.defaults = function (obj) {
		_.each(slice.call(arguments, 1), function (source) {
			if (source) {
				for (var key in source) {
					if (obj[key] === undefined) {
						obj[key] = source[key];
					}
				}
			}
		});

		return obj;
	};

	// Utility Methods
	// -----------------
	
	var reliableTypeofFunction = typeof (/./) !== 'function',
		reliableArgumentsString = toString.call(arguments).indexOf('Arguments') > -1, 
		class2type = {};

	_.each('Boolean Number String Function Array Date RegExp Object Error Arguments'.split(' '), function (name) {
		class2type['[object ' + name + ']'] = name.toLowerCase();
	});

	_.type = function (obj) {
		if (obj == null) {
			return obj + '';
		}

		// fallback for old browsers
		if (!reliableArgumentsString && _.has(obj, 'callee')) {
			return 'arguments';
		}

		return typeof obj === 'object' || (!reliableTypeofFunction && typeof obj === 'function') ? 
			class2type[toString.call(obj)] || 'object' : 
			typeof obj;
	};

	_.isArray = nativeIsArray || function (obj) {
		return _.type(obj) === 'array';
	};

	_.each('String Function Date RegExp Number Arguments Null Undefined Boolean Error'.split(' ') , function (name) {
		_['is' + name] = function (obj) {
			return _.type(obj) === name.toLowerCase(); 
		};
	});

	if (reliableTypeofFunction) {
		// `typeof` is much faster than `Object.prototype.toString.call`
		_.isFunction = function (obj) {
			return typeof obj === 'function';
		};
	}

	_.isObject = function (obj) {
		return obj === Object(obj);
	};

	_.isEmpty = function (obj) {
		if (obj == null) {
			return true;
		}

		if (_.isArray(obj) || _.isString(obj)) {
			return obj.length === 0;
		}

		for (key in obj) {
			if (_.has(obj, key)) {
				return false;
			}
		}

		return true;
	};

	_.isElement = function (obj) {
		return !!(obj && obj.nodeType === 1);
	};

	var uid = 0;
	_.uniqueId = function (prefix) {
		prefix = (prefix || '') + '';
		return prefix + (++uid);
	};

	_.random = function (min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}

		return min + Math.floor(Math.random() * (max - min + 1));
	};

	_.now = Date.now || function () {
		return +new Date();
	};

	function toParams (query) {
		var params = {};

		_.each(query.split('&'), function (val, idx) {
			var pair = val.split('=');
			params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		});	

		return params;
	}

	_.query = function (url) {
		url += '';
		var argv = arguments,
			type = _.type(argv[1]),
			query = '';

		if (rquery.test(url)) {
			query = RegExp.$1;
		}

		if (argv.length === 2 && type !== 'object') {
			if (type === 'string') {
				var result;
				result = _.find(query.split('&'), function (val, idx) {
					return decodeURIComponent(val.split('=')[0]) === argv[1];
				});
				return decodeURIComponent(String(result).split('=')[1] || '');
			} else if (type === 'array') {
				var params = toParams(query),
					defaults = {};

				_.each(argv[1], function (val, idx) {
					defaults[val] = '';
				});

				return _.extend(defaults, _.pick.apply(_, [params].concat(argv[1])));
			} 
		} 

		var data = argv[1],
			result;

		// transform _.query(url, key, value) to _.query(url, object) format
		if (argv.length === 3) {
			data = {};
			data[argv[1]] = argv[2];
		}

		result = _.map(_.compact(query.split('&')), function (val, idx) {
			var pair = val.split('='),
				key = decodeURIComponent(pair[0]);

			if (_.has(data, key)) {
				pair[1] = encodeURIComponent(data[key]);
				delete data[key];
			}

			return pair.join('=');
		});

		result = '?' + result.concat(_.map(data, function (val, key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		})).join('&');

		if (query) {
			return url.replace(rquery, result);
		}
		
		// If the url has hash but no search
		if (url.indexOf('#') > -1) {
			return url.replace(rhash, result + '$&');
		}

		return url + result;
	};

	/*
	 * yy = short year
	 * yyyy = long year
	 * M = month(1-12)
	 * MM = month(01-12)
	 * d = day(1-31)
	 * dd = day(01-31)
	 * h = hour in am/pm(0-12)
	 * hh = hour in am/pm(00-12)
	 * H = hour in day(0-23)
	 * HH = hour in day(00-23)
	 * m = minute(0-60)
	 * mm = minute(00-60)
	 * s = second(0-60)
	 * ss = second(00-60)
	 * S = milliseconds(0-999)
	 * SSS = milliseconds(000-999)
	 *
	 * may add in future:
	 * a = AM/PM marker
	 * p = a.m./p.m. marker
	 * ddd = day of the week in words (Monday, Tuesday … Sunday)
	 * D = Ordinal day (1st, 2nd, 3rd, 21st, 22nd, 23rd, 31st, 4th…)
	 * MMM = month abbreviation (Jan, Feb … Dec)
	 * MMMM = long month (January, February … December)
	 */
	_.dateFormat = function(date, format) {
		date = new Date(date);
		format += '';
		
		var struct = {
			'y': String(date.getFullYear()),
			'M': String(date.getMonth() + 1),
			'd': String(date.getDate()),
			'h': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
			'H': String(date.getHours()), 
			'm': String(date.getMinutes()),
			's': String(date.getSeconds()),
			'S': String(date.getMilliseconds())
		},
			validSyntax = 'yyyy yy MM M dd d hh h HH H mm m ss s SSS S'.split(' '),
			offset = 1,
			length = format.length,
			previous = format.charAt(0),
			result = '',
			syntax; 

		function formatter (syntax) {
			switch(syntax) {
				case 'yyyy':
					return struct.y;
				case 'yy':
					return struct.y.slice(2);
				case 'MM':
					return fix(struct.M);
				case 'M':
					return struct.M;
				case 'dd':
					return fix(struct.d);
				case 'd':
					return struct.d;
				case 'hh':
					return fix(struct.h);
				case 'h':
					return struct.h;
				case 'HH':
					return  fix(struct.H);
				case 'H':
					return struct.H;
				case 'mm':
					return fix(struct.m);
				case 'm': 
					return struct.m;
				case 'ss':
					return fix(struct.s);
				case 's':
					return struct.s;
				case 'SSS':
					return fix(struct.S, 3);
				case 'S':
					return struct.S;
				default:
					return syntax;
			};
		}

		function fix (value, len) {
			len = len || 2;
			var left = len - String(value).length,
				pad = '';

			for (var i = 0; i < left; i++) {
				pad += '0';
			}

			return pad + value;
		}

		while(offset < length) {
			if (previous.length === 1 && !_.has(struct, previous)) {
				result += previous;
				previous = format.charAt(offset);
				offset++;
				continue;
			}

			var current = format.charAt(offset + previous.length - 1);

			if (previous.charAt(0) === current) {
				previous += current;
				continue;
			} 

			while (previous) {
				if (_.contains(validSyntax, previous)) {
					result += formatter(previous);
					offset += previous.length;
					previous = format.charAt(offset - 1);

					if (offset >= length) {
						result += previous;
					}

					break;
				} else {
					previous = previous.slice(0, -1);
				}
			}
		}

		return result;
	};

	_.identity = function (value) {
		return value;
	};

	_.property = function (key) {
		return function (obj) {
			return obj[key];
		};
	};

	_.matches = function (attrs) {
		return function (obj) {
			if (obj === attrs) {
				return true;
			}

			for (var key in attrs) {
				if (attrs[key] !== obj[key]) {
					return false;
				}
			}

			return true;
		};
	};

	_.negate = function (predicate) {
		return function () {
			return !predicate.apply(this, arguments);
		};
	};

	_.noop = function () {};

	_.noConflict = function () {
		root._ = old_;
		return _;
	};

	_.chain = function (obj) {
		return _(obj).chain();
	};

	function result (obj) {
		return this._chain ? _(obj).chain() : obj;
	}

	// The purpose is to extend `_`.
	_.mixin = function (obj) {
		_.each(_.functions(obj), function (name) {
			var func = _[name] = obj[name];
			_.prototype[name] = function () {
				var argv = [this._obj].concat(slice.call(arguments)),
					obj = func.apply(this, argv);

				return result.call(this, obj);	
			};
		});
	};

	// Extend the `_` prototype, use for chain calling.
	_.mixin(_);

	// Extend the array prototype methods to _.prototype which `returnArray !== paramArray`.
	_.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
		var method = ArrayProp[name];
		_.prototype[name] = function () {
			var obj = this._obj;
			method.apply(obj, arguments);
			return result.call(this, obj);
		};
	});

	// Extend the array prototype methods to _.prototype which `returnArray === paramArray`.
	_.each(['concat', 'join', 'slice'], function (name) {
		var method = ArrayProp[name];
		_.prototype[name] = function () {
			return result.call(this, method.apply(this._obj, arguments));
		};
	});

	_.extend(_.prototype, {
		chain: function () {
			this._chain = true;
			return this;
		},

		value: function () {
			return this._obj;
		}
	});

	if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
        module.exports = _;
    } else if (typeof (define) === 'function' && define.amd) { // AMD
        define('plus', function () {
            return _;
        });
    } else { // Exports to global namespace.
    	root._ = _;
    }
})(this, undefined);