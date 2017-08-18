import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch} from 'common/js/cache'

export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCELIST,list)
	if(state.mode === playMode.random){
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST,randomList)
		index = findIndex(randomList,list[index])
	}else{
		commit(types.SET_PLAYLIST,list)
	}
	
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

export const insertSong = function({commit,state},song){
	let list = state.playList.slice();   //这里不能直接修改playList，因为他是引用类型的，可修改他的副本，sequenceList同理
	let currentIndex = state.currentIndex;   //state.currentIndex是值类型，这是赋值操作，可修改被赋值的currentIndex
	//记录当前歌曲
	let currentSong = list[currentIndex];
	//查找当前列表中是否已存在待插入的歌曲，并返回其索引值
	let fpIndex = findIndex(list,song);
	//插入到列表
	currentIndex++; //当前播放歌曲的下一个位置
	list.splice(currentIndex,0,song);
	
	//当前列表中已存在待插入的歌曲
	if(fpIndex>-1){
		if(fpIndex<=currentIndex){
			list.splice(fpIndex,1);
			currentIndex--;
		}else{
			list.splice(fpIndex+1,1);
		}
	}
	
	let sequenceList = state.sequenceList.slice();
	let currentSIndex = findIndex(sequenceList,currentSong);
	currentSIndex++;
	let fsIndex = findIndex(sequenceList,song);
	sequenceList.splice(currentSIndex,0,song);
	if(fsIndex>-1){
		if(fsIndex<=currentSIndex){
			sequenceList.splice(fsIndex,1);
			currentSIndex--;
		}else{
			sequenceList.splice(fsIndex+1,1);
		}
	}
	
	commit(types.SET_SEQUENCELIST,sequenceList)
	commit(types.SET_PLAYLIST,list)
	commit(types.SET_CURRENTINDEX,currentIndex)
	commit(types.SET_FULLSCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}

export const saveSearchHistory = function ({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}

export const deleteSearchHistory = function ({commit},item){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(item));
	
}




















function findIndex(list,song){
	return list.findIndex((item)=>{
		return item.id === song.id
	})
}
