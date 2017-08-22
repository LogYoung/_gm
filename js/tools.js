// 查找某个元素是否在数组中存在
// 如果存在，则返回其在数组中的下标
// 不存在，则返回 -1
// 参数：
//		value: 待查找值
//		array: 数组
// 返回值：
//		数组中的下标，-1表示不存在
function inArray(value, array) {
	if (Array.prototype.indexOf) // 浏览器支持使用 indexOf 方法
		return array.indexOf(value);
	// 不支持使用 indexOf() 方法，则循环遍历
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === value)
			return i;
	}
	return -1;
}

// 根据 id，类名，标签名查找元素
// #xxx -- id
// .xxx -- className
// xxx  -- tagName
// 参数：
//		selector : 选择器，可以为 id、类、元素选择器
//		context : 查找上下文，默认为 document
function $(selector, context) {
	context = context || document; // 默认 document
	if (selector.indexOf("#") === 0) // id选择器
		return document.getElementById(selector.slice(1));
	if (selector.indexOf(".") === 0) // 类选择器
		return getByClassName(selector.slice(1), context);
	// 元素选择器
	return context.getElementsByTagName(selector);
}

// 根据类名查找元素，解决 getElementsByClassName() 兼容问题
// 参数：
//		className : 待查找的类名
//		context : 查找上下文，默认 document
function getByClassName(className, context) {
	context = context || document;
	if (context.getElementsByClassName) // 支持使用 getElementsByClassName
		return context.getElementsByClassName(className);
	/* 不支持使用 getElementsByClassName */
	/* 方法：在查找上下文的后代中，遍历所有元素，
	 * 比较遍历到的元素是否有使用待查找的类名，
	 * 有则说明遍历到的元素是要查找的元素 */

	// 存放查找到的所有元素的数组
	var result = [];
	// 查找上下文后代的所有元素
	var elements = $("*", context);
	// 循环遍历所有元素
	for (var i = 0, len = elements.length; i < len; i++) {
		// 获取当前遍历到元素使用的所有类名
		var classNames = elements[i].className.split(" ");
		// 遍历当前元素的所有类名，判断是否有待查找的类名
		if (inArray(className, classNames) !== -1) // 说明当前元素是需要查找的元素之一
			result.push(elements[i]);
		/*for (var j = 0, length = classNames.length; j < length; j++) {
			if (classNames[j] == className) {
				result.push(elements[i]);
				break;
			}
		}*/
	}
	// 返回查找到的结果
	return result;
}

// 封装函数，获取/设置元素的CSS属性值
// 参数：
//		element: 元素
//		attr: 可取对象和字符串类型，字符串表示属性名，对象表示设置各属性及值
//		value: CSS属性值
// 返回值：
//		在获取元素CSS属性值的情况下，返回字符串
function css(element, attr, value) {
	// 获取
	if (typeof attr === "string" && typeof value === "undefined")
		return window.getComputedStyle 
				? getComputedStyle(element)[attr] 
				: element.currentStyle[attr];

	// 设置元素的CSS属性值
	if (typeof attr === "object") { // 第二个参数为对象，设置CSS属性值
		for (var prop in attr) {
			element.style[prop] = attr[prop];
		}
	} else {
		element.style[attr] = value;
	}
}

// 阅读以下代码
// 为指定元素添加 class 类名
function addClass(element, className) {
	var classNames = element.className.split(" "),
		index = inArray(className, classNames);
	if (index !== -1)
		classNames.splice(index, 1);
	classNames.push(className);
	element.className = classNames.join(" ");
}

// 为指定元素移除 class 类名
function removeClass(element, className) {
	var classNames = element.className.split(" "),
		index = inArray(className, classNames);
	if (index === -1)
		return;
	classNames.splice(index, 1);
	element.className = classNames.join(" ");
}

function show(element){
	css(element, "display", "block");
}

function hide(element) {
	css(element, "display", "none");
}

// 注册事件监听
function on(element, type, callback) {
	if (element.addEventListener) { // 支持使用 addEventListener() 方法
		if (type.indexOf("on") === 0) // 以 on 开头，则去掉 on 前缀
			type = type.slice(2);
		element.addEventListener(type, callback);
	} else { // 不支持 addEventListener 则使用 attachEvent
		if (type.indexOf("on") !== 0) // 不以 on 开头，则添加 on 前缀
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

// 解除事件绑定
function off(element, type, callback) {
	if (element.removeEventListener) { // 支持使用 removeEventListener() 方法
		if (type.indexOf("on") === 0) // 以 on 开头，则去掉 on 前缀
			type = type.slice(2);
		element.removeEventListener(type, callback);
	} else { // 不支持 removeEventListener 则使用 detachEvent
		if (type.indexOf("on") !== 0) // 不以 on 开头，则添加 on 前缀
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}

// 保存 cookie
// 参数：
//		key : cookie 名
//		value : cookie 值
// 		options : 可配置选项，是对象的类型，如：
//			{expires:100, path:"/", domain:".baidu.com", secure:true}
function setCookie(key, value, options) {
	var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value); // "key=value"

	options = options || {};
	if (options.expires) { // 有设置失效时间
		var date = new Date();
		date.setDate(date.getDate() + options.expires);
		cookie += ";expires=" + date.toUTCString();
	}
	if (options.path) { // 有设置保存路径
		cookie += ";path=" + options.path;
	}
	if (options.domain) { // 有设置域名
		cookie += ";domain=" + options.domain;
	}
	if (options.secure) { // 有设置安全链接
		cookie += ";secure";
	}
	// 保存cookie
	document.cookie = cookie;
}

// 删除 cookie
function removeCookie(key, options){
	options = options || {};
	options.expires = -1;
	setCookie(key, "", options);
}

// 读取 cookie
// 参数：
//		key : 待查找的 cookie 名字符串
// 返回值：
//		查找到，返回 cookie 值字符串，未查找到，则返回 null
function getCookie(key) {
	var cookies = document.cookie.split("; ");
	for (var i = 0, len = cookies.length; i < len; i++) {
		var cookie = cookies[i].split("="),
			name = decodeURIComponent(cookie.shift());
		if (key == name)
			return decodeURIComponent(cookie.join("="));
	}

	return null;
}

// 运动框架
// 参数：
//		element : 待添加运动动画效果的元素
//		options : 运动动画设置目标终值的对象
//		speed : 控制总运动时长
//		fn : 可选函数，在运动动画结束后要执行的函数
function animate(element, options, speed, fn) {
	clearInterval(element.timer);

	// 为多属性初值、范围设定对象
	var start = {}, range = {};
	for (var attrName in options) {
		start[attrName] = parseFloat(css(element, attrName));
		range[attrName] = options[attrName] - start[attrName];
	}
	// 记录启动计时器前时间
	var startTime = +new Date();
	element.timer = setInterval(function(){
		// 计算运动消耗时间
		var elapsed = Math.min(+new Date() - startTime, speed);
		// 计算各属性当前步
		for (var attrName in options) {
			var result = elapsed * range[attrName] / speed + start[attrName];
			element.style[attrName] = result + (attrName === "opacity" ? "" : "px");
		}
		// 判断是否停止计时器
		if (elapsed === speed) {
			clearInterval(element.timer);
			fn && fn();
		}
	}, 1000/60);
}

// 淡入
function fadeIn(element, speed, fn) {
	css(element, "opacity", 0);
	show(element);
	animate(element, {opacity:1}, speed, fn);
}

// 淡出
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		hide(element);
		fn && fn();
	});
}

// 获取/设置元素在文档中的定位
// 参数：
//		element: DOM元素
//		coordinates: 待设置的文档坐标，以{}对象传递，有top，left两个属性
function offset(element, coordinates) {
	if (typeof coordinates === "undefined") { // 获取
		var _top = 0, _left = 0;
		while(element) {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		}
		return {
			top : _top,
			left : _left
		};
	} else { // 设置
		// 求 element父元素在文档中的坐标
		var _top = 0, _left = 0, _currElem = element.offsetParent;
		while(_currElem) {
			_top += _currElem.offsetTop;
			_left += _currElem.offsetLeft;
			_currElem = _currElem.offsetParent;
		}
		// 将当前元素设置在文档中坐标与父元素在文档中坐标换算
		css(element, {
			top : coordinates.top - _top + "px",
			left : coordinates.left - _left + "px"
		});
	}	
}

// 查找元素 border 内部宽度
function innerWidth(element) {
	if (css(element, "display") !== "none")
		return element.clientWidth;

	return parseFloat(css(element, "width")) + 
			parseFloat(css(element, "paddingLeft")) +
			parseFloat(css(element, "paddingRight"));
}

// 查找元素 border 及内部宽度
function outerWidth(element) {
	if (css(element, "display") !== "none")
		return element.offsetWidth;

	return parseFloat(css(element, "width")) + 
			parseFloat(css(element, "paddingLeft")) +
			parseFloat(css(element, "paddingRight")) +
			parseFloat(css(element, "borderLeftWidth")) +
			parseFloat(css(element, "borderRightWidth"));
}

// ajax
/*  options = {
		type : "get|post", // 请求方式，默认为 get
		url : "path", // 请求资源的url
		data : {username:"张三", "password":"abc"}, // 需要向服务器传递的数据
		dataType : "json|text", // 预期从服务器返回的数据格式
		success : function(responseData){}, // 请求成功时执行的函数
		error : function(errorMsg){} // 请求失败时执行的函数
	}
*/
function ajax(options) {
	var url = options.url; // 请求资源的 URL
	if (!url) // 没有请求的 URL 则直接结束函数执行，不需要再向后执行
		return;
	var method = options.type || "get"; // 请求方式，默认为 get

	// 如果有向服务器传递的数据，则连接查询字符串内容
	var queryString = null; // 查询字符串
	if (options.data) { 
		queryString = [];
		for (var attr in options.data) {
			queryString.push(attr + "=" + options.data[attr]);
		}
		queryString = queryString.join("&");
	}
	// 如果是 get 请求的方式，则将查询字符串串联到URL后
	if (method === "get" && queryString) {
		url += "?" + queryString;
		queryString = null;
	}

	// 创建核心对象
	var xhr = new XMLHttpRequest();
	// 打开
	xhr.open(method, url, true);
	// 发送请求
	if (method === "post")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(queryString);
	// 处理响应
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // 请求成功
				var data = xhr.responseText;
				if (options.dataType === "json")
					data = JSON.parse(data);
				// 数据处理逻辑
				options.success && options.success(data);
			} else { // 请求失败
				options.error && options.error(xhr.statusText);
			}
		}
	}
}

function get(url, data, success, dataType) {
	ajax({
		url : url,
		type : "get",
		data : data,
		dataType : dataType,
		success : success
	});
}

function post(url, data, success, dataType) {
	ajax({
		url : url,
		type : "post",
		data : data,
		dataType : dataType,
		success : success
	});
}

function getJSON(url, data, success) {
	ajax({
		url : url,
		type : "get",
		data : data,
		dataType : "json",
		success : success
	});
}