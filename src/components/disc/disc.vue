<template>
	<div class="disc">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</div>
</template>

<script>
import musicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'

export default{
	data(){
		return{
			songs:[]
		}
	},
	computed:{
		title(){
			return this.disc.dissname
		},
		bgImage(){
			return this.disc.imgurl
		},
		...mapGetters([
			'disc'
		])
	},
	created(){
//		this._getSongList()
	},
	methods:{
		_getSongList(){
			getSongList(this.disc.dissid).then((res)=>{
				if(res.code === ERR_OK){
					console.log(res.cdlist[0].songlist);
					this.songs = this._normalizeSongs(res.cdlist[0].songlist);
				}
			})
		},
		_normalizeSongs(list){
			let ret = [];
			list.forEach((musicData)=>{
				if(musicData.songid && musicData.albumid){
					ret.push(createSong(musicData));
				}
			})
			return ret
		}
	},
	components:{
		musicList
	}
}
</script>

<style>
.disc{
	
}
</style>