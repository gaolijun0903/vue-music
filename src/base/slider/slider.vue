<template>
<div class="slider" ref="slider">
	<div class="slider-group" ref="sliderGroup">
		<slot></slot>	
	</div>
	<div class="dots">
		<span class="dot" v-for="(item,idx) in dots" :class="{'active':currentIdx === idx}"></span>
	</div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default{
    name: 'slider',
	props:{
		loop:{
			type: Boolean,
			default: true
		},
		autoPlay:{
			type: Boolean,
			default: true
		},
		interval:{
			type: Number,
			default: 4000
		}
	},
	data(){
		return{
			dots: [],
			currentIdx: 0
		}
	},
	mounted(){
		setTimeout(()=>{
			this._setSliderWidth();
			this._initDots();
			this._initSlider();
			if(this.autoPlay){
				this._play();
			}
		},20)
		
		window.addEventListener('resize',()=>{
			if(!this.slider){
				return
			}
			this._setSliderWidth(true);
			this.slider.refresh();
		})
	},
	activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
	beforeDestroy(){
		clearTimeout(this.timer);
	},
	methods:{
		_setSliderWidth(isResize){
			this.children = this.$refs.sliderGroup.children;
			
			let width = 0;
			let sliderWidth = this.$refs.slider.clientWidth;
			for(let i=0; i<this.children.length; i++){
				let child = this.children[i];
				addClass(child,'slider-item');
				child.style.width = sliderWidth + 'px';
				width += sliderWidth;
			}
			if(this.loop && !isResize){
				width += 2*sliderWidth;
			}
			this.$refs.sliderGroup.style.width = width + 'px';
		},
		_initSlider(){
			this.slider = new BScroll(this.$refs.slider,{
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapLoop: this.loop,
				snapThreshold: 0.3,
				snapSpeed: 400
			})
			
			this.slider.on('scrollEnd', ()=>{
				let pageIdx = this.slider.getCurrentPage().pageX;
				if(this.loop){
					pageIdx -= 1;
				}
				this.currentIdx = pageIdx;
				if(this.autoPlay){
					clearTimeout(this.timer);
					this._play();
				}
			})
		},
		_initDots(){
			this.dots = new Array(this.children.length);
		},
		_play(){
			let pageIdx = this.currentIdx + 1;
			if(this.loop){
				pageIdx += 1;
			}
			this.timer = setTimeout(()=>{
				this.slider.goToPage(pageIdx,0,400)
			},this.interval)
		}
	}
}
</script>

<style>
.slider{
	min-height: 1px;
}
.slider .slider-group{
	position: relative;
	white-space: nowrap;
	overflow: hidden;
}
.slider .slider-group .slider-item{
	float: left;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
}
.slider .slider-group .slider-item a{
	display: block;
  	width: 100%;
  	overflow: hidden;
  	text-decoration: none;
}	
.slider .slider-group .slider-item img{
	display: block;
  	width: 100%;
}

.slider .dots{
	position: absolute;
	right: 0;
  	left: 0;
  	bottom: 12px;
  	text-align: center;
  	font-size: 0;
}
.slider .dots .dot{
	display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
}
.slider .dots .dot.active{
    width: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
}
</style>