<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
	<div class="bar-inner">
		<div class="progress" ref="progress"></div>
		<div class="progress-btn-wrapper" 
			ref="progressBtn"
			@touchstart.prevent="progressTouchStart"
			@touchmove.prevent="progressTouchMove"
			@touchend="progressTouchEnd">
			<div class="progress-btn"></div>
		</div>
	</div>
</div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16;
const transform = prefixStyle('transform');

export default{
	props:{
		percent:{
			type:Number,
			default:0
		}
	},
	created(){
		this.touch = {}
	},
	methods:{
		progressClick(e){
			const rect = this.$refs.progress.getBoundingClientRect();//--返回一个矩形对象
			const offsetWidth = e.pageX - rect.left - progressBtnWidth/2
			this._offset(offsetWidth);
			//当我们点击小球按钮的时候，e.offsetX获取位置不对
			//this._offset(e.offsetX-progressBtnWidth/2); //------------event.offsetX 相对容器的水平坐标!!!!!!!!!!!!!
			this._triggerPercent();
		},
		progressTouchStart(e){
			this.touch.initiated = true;
			this.touch.x1 = e.touches[0].pageX;
			this.touch.left = this.$refs.progress.clientWidth;
		},
		progressTouchMove(e){
			if(!this.touch.initiated){
				return
			}
			const deltaX = e.touches[0].pageX - this.touch.x1;
			const offsetWidth = Math.min(Math.max(0, this.touch.left+deltaX), this.$refs.progressBar.clientWidth - progressBtnWidth);
			this._offset(offsetWidth);
		},
		progressTouchEnd(e){
			this.touch.initiated = false;
			this._triggerPercent();
		},
		_triggerPercent(){
			const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
			const percent = this.$refs.progress.clientWidth / barWidth;
			this.$emit('percentChange',percent);
		},
		_offset(offsetWidth){
			this.$refs.progress.style.width = `${offsetWidth}px`;
			this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
		},
	},
	watch:{
		percent(newPercent){
			if(newPercent >= 0 && !this.touch.initiated){
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				const offsetWidth = newPercent * barWidth;
				this._offset(offsetWidth);
			}
		}
	}
}
</script>

<style>
.progress-bar{
	height: 30px;
}
.progress-bar .bar-inner{
	position: relative;
	top: 13px;
	height: 4px;
	background: rgba(0,0,0,0.4);
}
.progress-bar .bar-inner .progress{
	position: absolute;
	height: 100%;
	background: #ffcd32;
}
.progress-bar .bar-inner .progress-btn-wrapper{
	position: absolute;
	left: -8px;
	top: -13px;
	width: 30px;
	height: 30px;
}
.progress-bar .bar-inner .progress-btn-wrapper .progress-btn{
	position: absolute;
	top: 7px;
	left: 7px;
	width: 16px;
	height: 16px;
	box-sizing: border-box;
	border:3px solid #FFFFFF;
	border-radius: 50%;
	background: #ffcd32;
}


















</style>