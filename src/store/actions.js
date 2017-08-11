import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCELIST,list)
	//这里有问题，视频7-18
	commit(types.SET_PLAYLIST,list)
	commit(types.SET_CURRENTINDEX,index)
	commit(types.SET_FULLSCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay = function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random)
	commit(types.SET_SEQUENCELIST,list)
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST,randomList)
	commit(types.SET_CURRENTINDEX,0)
	commit(types.SET_FULLSCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}
