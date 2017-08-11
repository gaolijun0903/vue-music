<template>
<transition name="slide">
	<music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
</transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'

export default{
	props:{
		
	},
	data(){
		return{
			songs:[]
		}
	},
	computed:{
		title(){
			return this.singer.name
		},
		bgImage(){
			return this.singer.avatar
		},
		...mapGetters([
			'singer'
		])
	},
	created(){
		this._getSingerDetail();
	},
	methods:{
		_getSingerDetail(){
			if(!this.singer.id){
				this.$router.push('/singer');
				return
			}
			getSingerDetail(this.singer.id).then((res)=>{
				if(res.code === ERR_OK){
					this.songs = this._normalizeSongs(res.data.list);
//					console.log(this.songs)
//					console.log(this.singer)
				}
			})
		},
		_normalizeSongs(list){
			let ret =[]
			list.forEach((item)=>{
				let {musicData} = item;
				if(musicData.songid && musicData.albummid){
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
.slide-enter-active,.slide-leave-active{
	transition: all .3s;
}
.slide-enter,.slide-leave-to{
	transform: translate3d(100%,0,0);
}
</style>