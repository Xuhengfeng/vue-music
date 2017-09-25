//最好和线上的接口一样 , 省的被封接口

export const commonParams = {//url 共同的查询参数
  g_tk:5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
	format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

// 基于jsonp方库，设置自定义的cbname
// 解决cbname未定义的问题
export const options1 = {
  param: 'jsonpCallback',
  prefix: 'playlistinfoCallback'
}


export const ERR_OK = 0