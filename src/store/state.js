import {playMode} from 'common/js/config'
import {loadSearch,loadPlay} from 'common/js/cache'

const state = {
	singer:{},
	playing:false,
	fullScreen:false,
	mode:playMode.sequence,
	playList:[],
	sequenceList:[],
	currentIndex: -1,
	disc:{},
	toplist:{},
	searchHistory:loadSearch(),
	playHistory:[]
}

export default state