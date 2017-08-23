import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay} from 'common/js/cache'

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

export const deleteSong = function({commit,state},song){
	let playlist = state.playList.slice();
	let sequencelist = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	let pIndex = findIndex(playlist,song);
	let sIndex = findIndex(sequencelist,song);
	playlist.splice(pIndex,1);
	sequencelist.splice(sIndex,1);
	if(currentIndex>pIndex || currentIndex===playlist.length){
		currentIndex--
	}
	commit(types.SET_SEQUENCELIST,sequencelist)
	commit(types.SET_PLAYLIST,playlist)
	commit(types.SET_CURRENTINDEX,currentIndex)
	if(!playlist.length){
		commit(types.SET_PLAYING_STATE,false)
	}else{
		commit(types.SET_PLAYING_STATE,true)
	}
}

export const clearSongList = function ({commit}){
	commit(types.SET_SEQUENCELIST,[])
	commit(types.SET_PLAYLIST,[])
	commit(types.SET_CURRENTINDEX,-1)
	commit(types.SET_PLAYING_STATE,false)
}

export const saveSearchHistory = function ({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}

export const deleteSearchHistory = function ({commit},item){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(item));
}
export const clearSearchHistory = function ({commit}){
	commit(types.SET_SEARCH_HISTORY,clearSearch());
}

export const savePlayHistory = function({commit,state},song){
	commit(types.SET_PLAY_HISTORY,savePlay(song))
}

















function findIndex(list,song){
	return list.findIndex((item)=>{
		return item.id === song.id
	})
}
