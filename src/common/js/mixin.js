import {mapGetters,mapActions,mapMutations} from 'vuex'

import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'


export const playlistMixin = {
	computed:{
		...mapGetters([
			'playList'
		])
	},
	mounted(){
		this.handlePlaylist(this.playList)
	},
	activated(){
		this.handlePlaylist(this.playList)
	},
	watch:{
		playList(newVal){
			this.handlePlaylist(newVal)
		}
	},
	methods:{
		handlePlaylist(){
			throw new Error('component must implement handlePlaylist method')
		}
	}
}

export const playerMixin = {
	computed:{
		iconMode(){
			return this.mode===playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop' : 'icon-random';
		},
		...mapGetters([
			'playList',
			'sequenceList',
			'currentSong',
			'mode'
		])
	},
	methods:{
		changeMode(){//播放模式切换
			const mode = (this.mode + 1) % 3;
			this.setPlayMode(mode);
			//修改歌曲列表
			let list = null;
			if(mode === playMode.random){
				list = shuffle(this.sequenceList);
			}else{
				list = this.sequenceList;
			}
			//设置currentIndex
			this._resetCurrentIndex(list);//注意顺序，最后设置playlist
			this.setPlayList(list);
		},
		_resetCurrentIndex(list){
			let index = list.findIndex((item)=>{        //----ES6语法！！！！
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index);
		},
		...mapMutations({
			setCurrentIndex: 'SET_CURRENTINDEX',
			setPlayMode:'SET_PLAY_MODE',
			setPlayList:'SET_PLAYLIST',
			setPlayingState:'SET_PLAYING_STATE'
		})
	}
}

export const searchMixin = {
	data(){
		return {
			query:''
		}
	},
	computed:{
		...mapGetters([
			'searchHistory'
		])
	},
	methods:{
		blurInput(){
			this.$refs.searchBox.blur();
		},
		onQueryChange(newQuery){
			this.query = newQuery
		},
		addQuery(k){
			this.$refs.searchBox.setQuery(k);
		},
		saveSearch(){
			this.saveSearchHistory(this.query);
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		])
	}
}
