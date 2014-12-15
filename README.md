#Plus.js 


A mini javascript library for web developers, base on underscore.js.

## Collection Methods

#### _.each(obj, func, [context]) *ecmascript 5*  

对指定数组、对象的每个元素执行指定操作。

func接受3个参数: (val, idx, list)

	var countIdx = 0,
		countValue = 0,
		countList;

	_.each([1,2,3], function (val, idx, list) {
		countIdx += idx;
		countValue += val;
		countList = list;
	});
	=> countIdx:    3
	=> countValue:  6
	=> countList:   [1, 2, 3]
		
#### _.map(obj, func, [context]) *ecmascript 5* 

对数组、对象的每个元素调用定义的回调函数并返回包含结果的数组。

func接受3个参数: (val, idx, list)

	_.map([1, 3, 5], function (val, idx, list) {
		return val + 2;
	});
	=> [3, 5, 7]
	
#### _.pluck(obj, value)

获取obj中，值为value的所有元素，返回的是一个数组。

	_.pluck([{
		age: 50,
		name: 'joe'
	}, {
		age: 35,
		name: 'jason'
	}, {
		age: 20,
		name: 'jacket'
	}], 'age');
	=> [50, 35, 20]
	
#### _.find(obj, predicate, [context])

在给定obj中寻找第一个predicate为true的元素，如果未找到，则返回undefined。

predicate接受3个参数: (val, idx, list)

	_.find([5, 4, 3, 2, -1, 0], function (val, idx, list) {
		return idx === 4;
	});
	=> -1
	
#### _.filter(obj, predicate, [context]) *ecmascript 5*

从obj中过滤出predicate为true的元素，与find不同的是，filter会查找所有符合要求元素，而不是查找到第一个之后就停止查找。返回一个数组。

predicate接受3个参数: (val, idx, list)

alias: _.grep

	_.filter([1, -1, 3, 5], function (val, idx, list) {
		return val > 0;
	});
	=> [1, 3, 5]
	
#### _.reject(obj, predicate, [context])

与_.filter相反，返回predicate为false的元素。

predicate接受3个参数: (val, idx, list)

	_.reject([1, -1, 3, 5], function (val, idx, list) {
		return val > 0;
	});
	=> [-1]
	
#### _.where(obj, attrs)

从给定obj中过滤出所有符合attrs过滤条件的元素。

	_.where([{
		age: 50,
		idx: 0,
		name: 'jason'
	}, {
		age: 50,
		idx: 0,
		name: 'rocket'
	}, {
		age: 50,
		idx: 1,
		name: 'tom'
	}, {
		age: 40,
		idx: 0,
		name: 'test'
	}], {
		age: 50,
		idx: 0
	});  // 过滤 age === 50 && idx === 0的所有元素
	=> [{
		age:50,
		idx: 0,
		name: 'jason'
	}, {
		age: 50,
		idx: 0,
		name: 'rocket'
	}]
	
#### _.findWhere(obj, attrs)

从给定obj中过滤出第一个符合attrs过滤条件的元素。

	_.findWhere([{
		age: 10,
		name: 'jack'
	}, {
		age: 18,
		name: 'tom'
	}, {
		age: 18,
		name: 'jerry'
	}], {
		age: 18
	});
	=> {
		age: 18,
		name: 'tom'
	}
	
#### _.every(obj, predicate, [context]) *ecmascript 5*

确定数组、对象的所有元素是否满足指定的测试。

predicate接受3个参数：(val, idx, list)

	_.every([1, 9 ,10, 20], function (val, idx, list) {
		return val > 0;
	});
	=> true
	
#### _.some(obj, predicate, [context]) *ecmascript 5*

给定obj中，只要有一个元素能让predicate返回为true，则返回true；否则为false。

predicate接受3个参数：(val, idx, list)

alias: _.any

	_.some([1, 2, 4, -1], function (val, idx, list) {
		return val < 0;
	});
	=> true

#### _.contains(obj, target)

判断给定的target值是否在obj中。

*（注意：该函数只用来处理数组、对象，不用作String.indexOf > -1的判断）*

	_.contains([1, 3, 5, 4, 9], 4);
	=> true
	
#### _.size(obj)

返回数组、对象的元素个数。（不遍历对象原型）
	
	_.size({
		a: 1,2,3
		b: 2,
		c: 3
	});
	=> 3
	
#### _.toArray(obj)

将argument对象、类数组、对象等转换为数组。

	var argv;
	(function (a, b) {
		argv = _.toArray(arguments);
	})(1, 2);
	=> argv: [1, 2]
	
#### _.max(obj, [iterator], [context])

从obj中选出值最大的元素；如果有传递iterator，则根据iterator返回的值来比较。

iterator接受3个参数：(val, idx, list)

	_.max({
		a: 10,
		b: 20, 
		c: 30
	});
	=> 30

	// use iterator
	_.max([{
		age: 50,
		name: 'jack'
	}, {
		age: 30,
		name: 'tom'
	}, {
		age: 45,
		name: 'jerry'
	}], function (val, key, obj) {
		return val.age;
	});
	=> {
		age: 50,
		name: 'jack'
	}
	
#### _.min(obj, [iterator], [context])

从obj中选出值最小的元素；如果有传递iterator，则根据iterator返回的值来比较。

iterator接受3个参数：(val, idx, list)

	_.max({
		a: 10,
		b: 20, 
		c: 30
	});
	=> 10
	
	_.max([{
		age: 50,
		name: 'jack'
	}, {
		age: 30,
		name: 'tom'
	}, {
		age: 45,
		name: 'jerry'
	}], function (val, key, obj) {
		return val.age;
	});
	=> {
		age: 30,
		name: 'tom'
	}
	
#### _.sortBy(obj, [iterator], [context])

根据iterator返回的值对obj的元素进行排序，如果没有传入iterator，则根据obj中元素的值由小到大进行排序。

iterator接受3个参数：(val, idx, list)

	_.sortBy({
		a: 4,
		b: 3,
		c: 5
	});
	=> [3,4,5]

#### _.groupBy(obj, iterator, [context])

对obj中的元素按iterator返回的值进行归类。

iterator接受3个参数：(val, idx, list)

	_.groupBy(['one', 'two', 'three', 'four', 'five', 'six'], function (val) {
		return val.length;
	});
	=> {
		3: ['one', 'two', 'six'],
		4: ['four', 'five'],
		5: ['three']
	}

#### _.indexBy(obj, iterator, [context])

对obj中的元素按iterator返回的值进行归类，与\_.groupBy不同的是，归类的值是一个对象，如果iterator返回多个相同的key，后面的值会覆盖前面的。

iterator接受3个参数：(val, idx, list)

	_.indexBy([{
		age: 20,
		name: 'jerry'
	}, {
		age: 30,
		name: 'lucy'
	}, {
		age: 40,
		name: 'tommy'
	}], function (obj) {
		return obj.age;
	});
	=> {
		'20': {
			age: 20,
			name: 'jerry'
		},
		'30': {
			age: 30,
			name: 'lucy'
		},
		'40': {
			age: 40,
			name: 'tommy'
		}
	}

#### _.countBy(obj, iterator, [context])

根据iterator返回的key值，计算每一个key值出现的次数。

iterator接受3个参数：(val, idx, list)

	_.countBy([1, 2, 3, 4, 5], function(num) {
  		return num % 2 == 0 ? 'even': 'odd';
	});
	=> {
		odd: 3,
		even: 2
	}


#### _.shuffle(obj)

数组乱序；如果传入的是一个对象，则对每个元素的值进行乱序排列并返回乱序数组。

	_.shuffle([5,4,3,2,1]);	
	=> [4, 1, 3, 5, 2] 	

#### _.sample(obj, [n])

从obj中随机抽取n个样本，n >= 1，默认为1。

	_.sample(source, 3);	
	=> [3, 9, 7]
	
#### _.partition(obj, predicate, [context])

将对象的元素分为两部分，predicate返回true的归类到第一部分，predicate返回false的归类到第二部分。

	_.partition([1, 2, 3, 4, 5], function (val) {
		return val % 2 === 0;
	});
	=> [[2, 4], [1, 3, 5]]

## Array Methods

#### _.reduce(obj, func, initialValue, [context]) *ecmascript 5*

对数组、对象中的所有元素调用指定的回调函数。 该回调函数的返回值为累积结果，并且此返回值在下一次调用该回调函数时作为参数提供。

func接受4个参数: (previousValue, currentValue, idx, list)

	_.reduce([1, 2, 3], function (prev, current, idx, list) {
		return prev + current;
	}, 3);
	=> 9
	
#### _.reduceRight(obj, func, initialValue, [context]) *ecmascript 5*

按降序顺序对数组中的所有元素调用指定的回调函数。 该回调函数的返回值为累积结果，并且此返回值在下一次调用该回调函数时作为参数提供。

func接受4个参数: (previousValue, currentValue, idx, list)

	_.reduceRight([1, 2, 3], function (prev, current, idx, list) {
		return prev - current;
	});
	=> 0

#### _.first(array, n)

返回数组的前n项元素，n >= 1，默认为1。

	_.first([1,2,3,4], 3);
	=> [1, 2, 3]

#### _.last(array, n)

返回数组的最后n项元素，n >= 1，默认为1。
	
	_.last([1,2,3,4]);
	=> 4

#### _.indexOf(array, target, [offset]) *ecmascript 5*

在数组中查找target对应的索引，如果找到则返回索引值，如果未找到则返回－1；offset默认为0。

	var source = [1, 3, 5, 7, 9, 3];

	_.indexOf(source, 3);
	=> 1

	_.indexOf(source, 3, 2);
	=> 5
	
#### _.lastIndexOf(array, target, [offset]) *ecmascript 5*

在数组中从右向左查找target对应的索引，如果找到则返回索引值，如果未找到则返回－1；offset默认为array.length - 1;

	var source = [1, 3, 5, 7, 9, 3];

	_.lastIndexOf(source, 3);
	=> 5

	_.lastIndexOf(source, 3, 4);
	=> 1

#### _.range(start, end, [step])

返回起始值为start（包含），终值 < end（不包含），步长增幅为step（默认1）的数组。

	_.range(1, 10, 2);
	[1, 3, 5, 7, 9]

#### _.uniq(array, [iterator], [context])

数组去重；如果传入了iterator，则根据iterator的返回值去重。

alias: _.unique

	_.uniq([1, 3, 5, 5, 7, 7, 9]);
	=> [1, 3, 5, 7, 9]

#### _.object(list, values)

将特定结构的数组转换为对象。

	// 接受参数形式：
	// 1. ([key1, key2, key3], [val1, val2, val3]) 两个数组
	// 2. ([[key1, val1], [key2, val2], [key3, val3]]) 单个数组

	_.object(['tom', 'jerry', 'justin'], [50, 60 , 70]);
	=> {
		tom: 50,
		jerry: 60,
		justin: 70
	}

	_.object([['tom', 50], ['jerry', 60], ['justin', 70]]);
	=> {
		tom: 50,
		jerry: 60,
		justin: 70
	}
	
#### _.compact(list)

过滤掉数组中`value == false`（null, undefined, '', 0,false）的元素。

	_.compact([1, 0, false, null, undefined, 3, '', 5, 7, 9]);
	=> [1, 3, 5, 7, 9]
	
#### _.flatten(list, shallow)

数组扁平化，默认会进行递归扁平化；如果传入shallow=true，则只扁平化一级数组。

	var source = [[[1,2,3], [4]], [5]];
	
	_.flatten(source);
	=> [1,2,3,4,5]

	_.flatten(source, true);
	=> [[1,2,3], [4], 5]
	
#### _.without(array, others*)

从第一个数组中过滤出其他数组中不存在的元素。

	_.without([1, -1, 3, 5, 9, 11], [1, 3], [2, 4], [5, 9]);
	=> [-1, 11]
	
#### _.union(array*) 

多个数组求并集。

	_.union([1, 3, 5], [1, 2, 3, 4], [5, 6, 7, 8]).sort();
	=> [1, 2, 3, 4, 5, 6, 7, 8]
	
#### _.intersection(array*)

多个数组求交集。

	_.intersection([1, 3, 5], [2, 3, 4, 5, 6], [2, 3, 5, 8]).sort();
	=> [3, 5]
	
#### _.insert(array, idx, item*)

	_.insert([1,2,3], 1, 5, 4);
	// [1,5,4,2,3] 	
	
## Function Methods

#### _.after(n, func)

返回一个函数，在调用过n次之后再执行；返回的函数可以接受任意参数，会传递给func。

	var count = 1,
		func = _.after(3, function () {
			count++;
		});

	func();
	func();
	func();
	=> count: 2
	
#### _.times(n, func, [context])

调用n次func，并返回结果数组；func接受一个参数i，表示第几次调用。

	var count = 1,
		_.times(3, function (i) {
			// i 为第几次调用
			return count++;
		});
	=> [1, 2, 3]
	
#### _.once(func)

返回一个函数，无论调用多少次，都只会执行一次。

	var count = 1,
		func;

	func = _.once(function () {
		return ++count;
	});

	func();
	=> 2

	func();
	=> 2
	
#### _.throttle(func, wait)

函数节流。返回一个函数，在调用后wait毫秒后执行；如果在wait毫秒之间再次调用返回的函数，则上次的调用被取消，并重新等待wait毫秒后执行。

	var func = _.throttle(function () {
		console.log('25ms内没有调用，我才会执行；如果有调用，则再等待25ms。');
	}, 25);

#### _.debounce(func, wait)

另一种意义上的函数节流。返回一个函数，在调用后立即执行，此后wait毫秒内的所有调用都会被忽略，wait毫秒之后的调用才会执行。

	var func = _.debounce(function () {
		console.log('调用我之后，25ms内的再次调用都会忽略；25ms外再调用才会执行。');
	}, 25) 

#### _.bind(func, context, [argv*]) *ecmascript 5*

将一个函数的context绑定到一个对象上，并返回新的函数。

alias: _.proxy *as jQuery.proxy* 


	var context = {
		test: function () {
			console.log(this);
		}
	};
	
	var func1 = _.bind(context.test, context);
	// func1调用test时，this仍指向context
	
	var func2 = _.bind(context, 'test');
	// func2调用test时，this仍指向context
	
#### _.partial(func, [argv*])

给一个函数预填充几个参数，并返回新的函数；不需要填充的参数用undefined代替。*可用_.partial代替curry*

	var func = _.partial(function (a, b, c, d, e) {
		return a + b + c + d + e;
	}, 1, undefined, 3, undefined);

	func(2, 4, 5);
	==> 15
	
#### _.wrap(func, wrapper)

	将func作为参数传递给另一个wrapper函数。
	
	var func = _.wrap(function () { 
		return 'test';
	}, function (func) {
		return 'wrap ' + func(); 
	});
	func();
	=> 'wrap test'

#### _.memoize(func, [hasher])

生成一个记忆形函数，所有计算过的值都会保存起来避免再次计算；这能大大提升执行斐波那契数列等大型数学运算时的效率；如果提供了hasher函数，则保存的key值通过hasher计算得到。

	var fibonacci = _.memoize(function(n) {
  		return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
	});

#### _.delay(func, wait)

延时wait毫秒后执行函数。

	_.delay(alert, 30); // 30ms后调用alert

#### _.defer(func)

相当于setTimeout(func, 0)。

	_.defer(alert); // setTimeout(alert, 0);

## Object Methods

#### _.extend(target, [sources])

把多个对象的属性继承到target（第一个）对象；默认进行浅复制，如果第一个参数传入true，则会对target（此时为第二个）对象进行深复制。

	var obj = _.extend({}, {
		a: 1,
		b: 2
	}, {
		c: 3
	});
	=> {
		a: 1,
		b: 2,
		c: 3
	}
	
#### _.has(obj, key)

等同于obj.hasOwnProperty(key);
	
	var obj = {
		a: 1
	};
	_.has(obj, 'a');
	=> true

#### _.keys(obj) *ecmascript 5*

返回一个数组，该数组包含obj的所有key值，该函数不会遍历原型属性。(keys返回的数组排序是不可预期的，如果对数组顺序有依赖，应该对返回的结果进行排序)

	_.keys({
		a: 1,
		b: 2,
		c: 3
	}).sort();
	=> ['a', 'b', 'c']
	
#### _.values(obj)

返回一个数组，该数组包含obj的所有元素的值，该函数不会遍历原型属性。(values返回的数组排序是不可预期的，如果对数组顺序有依赖，应该对返回的结果进行排序)

	_.values({
		a: 1,
		b: 2,
		c: 3
	}).sort();
	=> [1, 2, 3]
	
#### _.result(obj, key)

获取obj对象相应key的value值，如果key为'a.b'这种以`.`隔开的格式，则会遍历递归对象；如果obj[key]为函数，则返回函数执行的结果；如果未找到，则返回undefined。

	_.result({
		a: {
			b: 1
		}
	}, 'a.b');
	=> 1
	
#### _.invert(obj)

将obj的key与value互换得到一个新对象。

	_.invert({
		a: 1,
		b: 2,
		c: 3
	});
	=> {
		'1': 'a',
		'2': 'b',
		'3': 'c'
	}
	
#### _.pairs(obj)

返回一个[key, value]格式的数组。

	_.pairs({
		a: 1,
		b: 2,
		c: 3
	});
	=> [['a', 1], ['b', 2], ['c', 3]]
	
#### _.functions(obj)

返回一个已排序的、包含obj中所有函数名的数组(会遍历原型)。

	function TestObj () {
		this.a = function () {};
	}

	TestObj.prototype = {
		mark: function () {}
	}; 

	_.functions(new TestObj());
	=> ['a', 'mark']
	
#### _.create(obj) *ecmascript 5*

创建一个具有指定原型的对象（原型继承）；类似于Object.create，但不支持descriptors。

	var proto = {
		a: 1,
		b: 2
	},
		obj = _.create(proto);
	=> 'a' in obj && !obj.hasOwnProperty('a')
	
#### _.pick(obj, arrts*)

返回一个新的对象，该对象由从obj中过滤出的白名单里的元素组成。
	
	_.pick({
		age: 11,
		name: 'john',
		from: 'america',
		sex: 'male'
	}, 'age', 'sex');
	=> {
		age: 11,
		sex: 'male'
	}
	
#### _.omit(obj, attrs*)

与_.pick相反，返回一个新的对象，该对象由从obj中过滤出的不在白名单里的元素组成。

	_.omit({
		age: 11,
		name: 'john',
		from: 'america',
		sex: 'male'
	}, 'age', 'sex');
	=> {
		name: 'john',
		from: 'america'
	}
	
#### _.isEqual(obj, obj)

判断两个对象是否等价。

	!_.isEqual(0, -0); // 0与－0不等价
	=> true
	
	_.isEqual({
		a: 1,
		b: 2,
		c: {
			d: 1,
			f: 2
		}
	}, {
		a: 1,
		b: 2,
		c: {
			d: 1,
			f: 2
		}
	});
	=> true
	
	_.isEqual([1, 2, 3, [1, 3, 5]], [1, 2, 3, [1, 3, 5]]);
	=> true
	
#### _.defaults(obj, obj*)

类似于_.extend的浅复制，但只在obj（包括obj的原型）中没有该属性时，才能从其他obj上继承过来。

	var obj;

	function TestObj () {
		this.value = null;
	}

	TestObj.prototype = {
		a: 1,
		b: 2
	};

	_.defaults(obj = new TestObj(), {
		a: 3,
		b: 2
	}, {
		c: 4
	});
	
	obj.a;
	=> 1
	obj.c;
	=> 4
	
## Utility Methods

#### _.type(obj)

返回对象类型。

	_.type(1);                 // 'number'
	_.type('1');               // 'string'
	_.type(null);              // 'null'
	_.type(undefined);         // 'undefined'
	_.type({});                // 'object'
	_.type([]);                // 'array'     
	_.type(/./);               // 'regexp'
	_.type(new Date());        // 'date'
	_.type(function () {});    // 'function'
	_.type(arguments);         // 'arguments'

	
#### _.is	*(obj)

判断对象是否属于某一类型。

1. isArray
2. isString
3. isArguments
4. isDate
5. isRegExp
6. isNumber
7. isNull
8. isUndefined
9. isBoolean
10. isError
11. isFunction
12. isObject 
13. isElement

**new String(), new Number(), Array, RegExp, Object 等都属于Object，_.isObject会返回true。**

#### _.isEmpty(obj)

判断一个对象是否为空对象。

	_.isEmpty('');
	_.isEmpty(null);
	_.isEmpty(undefined);
	_.isEmpty({});
	_.isEmpty([]);
	_.isEmpty(1);
	_.isEmpty(false);
	
#### _.uniqueId(prefix)

生成唯一的id；如果传入prefix，则id前缀以prefix开始。

	_.uniqueId();
	=> '1'
	_.uniqueId();
	==> 2 

#### _.random(min, max)

随机生成范围由min-max(包含min跟max)的数字。如果只有一个参数，则该参数代表max，min为1。

	_.random(1, 10);
	=> 5

#### _.now()

返回当前时间戳。
	
	_.now();
	=> 1395993031506
	
#### _.query(url, key, value)

获取或者设置url的参数。

	// 获取单个url参数
	var url = 'http://www.test.com/file.html?a=1&c=2&d=&3#hash'
	_.query(url, 'a'); // => '1'
	_.query(url, 'f'); // => ''
	
	// 获取多个url参数
	_.query(url, ['a', 'c']); 
	=> { a: '1', c: '2' }
	
	// 设置单个url参数
	_.query(url, 'a', '2'); 
	=> 'http://www.test.com/file.html?a=2&c=2&d=&3#hash'
	
	// 设置多个url参数
	_.query(url, {
		a: '2',
		c: '3'
	});
	=> 'http://www.test.com/file.html?a=2&c=3&d=&3#hash'
	
#### _.dateFormat(date, format)

时间格式化。date参数可以是Date对象或时间戳。

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
	 */
	 
	var date = new Date(973836610010); // 2000,11,10 14:10:10:10
	_.dateFormat(date, 'yyyy-MM-dd HH-mm-ss');
	=> '2000-11-10 14-10-10'

#### _.socialTime(ts, now)
将时间戳格式化为社会化时间。ts: 要格式化的时间戳，now当前服务器时间（不传则用客户端时间）

	_.socialTime(+new Date());
	=> 刚刚

#### _.cookie
cookie存取函数。

	_.cookie.set('name', 'value');
	_.cookie.set({
		name1: 'value1',
		name2: 'value2'
	});
	_.cookie.get('name');
	=> 'value'
	_.cookie.get(['name1', 'name2']);
	=> {
		name1: 'value1',
		name2: 'value2'
	}

####_.toObject(serialStr)
URL参数转换为Object对象

	_.cookie.toObject('a=b&c=d'); 
	=> {
		a: 'b',
		c: 'd'
	}
	
	


	