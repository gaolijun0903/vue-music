<template>
<transition name="confirm-fade">
	<div class="confirm" v-show="showFlag" @click.stop>
		<div class="confirm-wrapper">
			<div class="confirm-content">
				<p class="text" v-html="text"></p>
				<div class="operate">
					<div class="operate-btn left" @click="confirm">{{confirmBtnText}}</div>
					<div class="operate-btn" @click="cancle">{{cancleBtnText}}</div>
				</div>
			</div>
		</div>
	</div>
</transition>
</template>

<script>
export default{
	props:{
		text:{
			type:String,
			default:''
		},
		confirmBtnText:{
			type:String,
			default:'确认'
		},
		cancleBtnText:{
			type:String,
			default:'取消'
		}
	},
	data(){
		return {
			showFlag:false
		}
	},
	methods:{
		show(){
			this.showFlag = true;
		},
		hide(){
			this.showFlag = false;
		},
		confirm(){
			this.hide();
			this.$emit('confirm');
		},
		cancle(){
			this.hide();
			this.$emit('cancle');
		}
	}
}
</script>

<style>
.confirm{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 998;
	background-color: rgba(0, 0, 0, 0.3);
}
.confirm-fade-enter-active{
	animation:confirm-fadeIn 0.3s;
}
.confirm-fade-enter-active .confirm-content{
	animation: confirm-zoom 0.3s;
}
@keyframes confirm-fadeIn{
	form {opacity:0;}
	to {opacity:1;}
}
@keyframes confirm-zoom{
	0% {transform:scale(0);}
	50% {transform:scale(1.1);}
	100% {transform:scale(1);}
}

.confirm .confirm-wrapper{
	position: absolute;
	top: 50%;
	left: 50%;
	transform:translate3d(-50%,-50%,0);
	z-index: 999;
}
.confirm .confirm-wrapper .confirm-content{
	width: 270px;
	border-radius: 13px;
	background-color: #333;
}
.confirm .confirm-wrapper .confirm-content .text{
	padding: 19px 15px;
	text-align: center;
	line-height: 22px;
	font-size: 18px;
	color:rgba(255, 255, 255, 0.5);
}
.confirm .confirm-wrapper .confirm-content .operate{
	display: flex;
	align-items: center;
	text-align: center;
	font-size: 18px;
}
.confirm .confirm-wrapper .confirm-content .operate .operate-btn{
	flex: 1;
	line-height: 22px;
	padding: 10px 0;
	border-top: 1px solid rgba(0, 0, 0, 0.3);
	color:rgba(255, 255, 255, 0.3);
}
.confirm .confirm-wrapper .confirm-content .operate .left{
	border-right: 1px solid rgba(0, 0, 0, 0.3);
}
</style>