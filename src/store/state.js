import {playMode} from 'common/js/config'
const state = {
	singer:{},
	playing:false,
	fullScreen:false,
	mode:playMode.sequence,
	playList:[],
	sequenceList:[],
	currentIndex: -1,
	disc:{}
}
export default state