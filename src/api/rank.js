import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

export function getRankList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
	const data = Object.assign({},commonParams,{
		uin:0,
		platform:'h5',
		needNewCode:1,
		_:1502855088042
	})
	return jsonp(url,data,options)
}

export function getToplist(id,type){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
	const data = Object.assign({},commonParams,{
		uin:0,
		platform:'h5',
		needNewCode:1,
		_:1502855088042,
		tpl:3,
		page:'detail',
		type:'top',
		topid:id
	})
	return jsonp(url,data,options)
}
