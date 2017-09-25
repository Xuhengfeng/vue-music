import originJSONP from 'jsonp'//引入jsonp模块

//简单的jsonp函数封装

export default function jsonp(url,data,option){//这里的data 是请求数据的对象,不是真正数据!
	
	url +=(url.indexOf("?")<0?"?":"&")+param(data);//相当数据的api 
	console.log('jsonp run now')
	return new Promise((resolve,reject)=>{//创建Promise对象表示创建了一个立即执行的代码（通常为ajax、jsonp这类异步代码），
		//并根据设立的条件（例如ajax请求状态为200OK）执行回调函数
		//承诺状态只会改变一次，状态一旦改变就不会再改变。换句话说，回调函数只会执行一次，且成功与失败回调函数只会执行其中一个。
		
		originJSONP(url,option,(err,data)=>{//每条数据
			 	if(!err){
			 		resolve(data)//异步操作成功时调用，并将异步操作的结果，作为参数传递出去
			 	}else{
			 		reject(err)//在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
			 	}
		})
	})
	
}

function param(data){//遍历请求数据的对象
	let url=''
	for (var k in data){
		let value=data[k]!==undefined?data[k]:""
		url +=`&${k}=${encodeURIComponent(value)}`
	}
	return url?url.substring(1):''
}
