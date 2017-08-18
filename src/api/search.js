import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey(){
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
	const data = Object.assign({},commonParams,{
		platform:'h5',
		needNewCode:1,
		_:1502940347994
	})
	
	return jsonp(url,data,options)
}

export function search(query,page,zhida,perpage){
	const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
	const data = Object.assign({},commonParams,{
		uin:0,
		platform:'h5',
		needNewCode:1,
		w:query,
		catZhida:zhida ? 1 : 0,
		t:0,
		flag:1,
		ie:'utf-8',
		sem:1,
		aggr:0,
		perpage,
		n:perpage,
		p:page,
		remoteplace:'txt.mqq.all',
		_:1502940347994
	})
	
	return jsonp(url,data,options)
}
