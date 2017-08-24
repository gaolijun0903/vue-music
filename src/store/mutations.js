import * as types from './mutation-types'

const mutations = {
	[types.SET_SINGER](state,singer){
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state,flag){
		state.playing = flag
	},
	[types.SET_FULLSCREEN](state,flag){
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state,list){
		state.playList = list
	},
	[types.SET_SEQUENCELIST](state,list){
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state,mode){
		state.mode = mode
	},
	[types.SET_CURRENTINDEX](state,currentIndex){
		state.currentIndex = currentIndex
	},
	[types.SET_DISC](state,disc){
		state.disc = disc
	},
	[types.SET_TOPLIST](state,toplist){
		state.toplist = toplist
	},
	[types.SET_SEARCH_HISTORY](state,searchHistory){
		state.searchHistory = searchHistory
	},
	[types.SET_PLAY_HISTORY](state,playHistory){
		state.playHistory = playHistory
	},
	[types.SET_FAVOURITE_LIST](state,favouriteList){
		state.favouriteList = favouriteList
	}
}
export default mutations