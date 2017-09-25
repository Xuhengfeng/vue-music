export function getRandomInt(min,max){//取随机整值min到max的函数
	/*Math.random返回0到1的小数,不包括1*/
	return Math.floor(Math.random()*(max-min+1)+min)//加1是保证取到上限的值,也就是包括min和max的值
	
}




export function shuffle(arr){//洗牌函数
	let _arr=arr.slice()//slice不带参数 默认是从下标0 ,截取到末尾, 返回一个新的数组;
	for(let i=0;i<_arr.length;i++){
		let j=getRandomInt(0,i)
		let t=_arr[i]
		_arr[i]=_arr[j]
		_arr[j]=t
	}
	return _arr
}


export function debounce(func,delay){//节流函数, func是要节流量函数 , 用计时器延迟调用,减少请求次数!
	let timer
	return function(...args){
		if(timer){
			clearTimeout(timer)
		}
		timer=setTimeout(()=>{//延迟func要节流的函数
			func.apply(this,args)
		},delay)
	}
}

