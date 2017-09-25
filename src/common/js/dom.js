export function hasClass(el,className){//检测元素是否有该样式
		let reg=new RegExp('(^|\\s)'+className+'(\\s|$)')//classname 前后都有可能是空格符\s,这里是字符串拼接 所以要转义一下;
		return reg.test(el.className)
}

export function addClass(el,className){//检测元素是否有该样式,并且添加新样式
	if(hasClass(el,className)){
		return
	}
	let newClass=el.className.split(' ')//拆开数组
	  newClass.push(className)
	el.className=newClass.join(' ')//连接 起来
}

export function getData(el,name,val){ //获取"data-xxx"属性名或者设置"data-xxx"属性值
	const prefix='data-'
    name=prefix+name
	if(val){
		return el.setAttribute(name,val)
	}else{
		return el.getAttribute(name)
	}
}

//浏览器样式能力检测 ,所有的样式能力
let elementStyle=document.createElement('div').style
let vendor=(()=>{//浏览器的供应商 返回前缀
	let transformNames={
		webkit:'webkitTransform',
		Moz:'MozTransform',
		o:'OTransform',
		ms:'msTransform',
		standard:'transform' //标准的
	}
	for(let key in transformNames){
		if(elementStyle[transformNames[key]]!==undefined){
			return key  //返回的是字符串类型
		}
	}
	return false//该浏览器有问题  (这是不可能的) 不支持transform样式
})()

export function prefixStyle(style){//给样式加前缀
	if(vendor===false){
		return false
	}
	if(vendor==='standard'){
		return style
	}
	
	return vendor+style.charAt(0).toUpperCase()+style.substr(1)//substr(1)表示从下标截取到字符串尾
}
