<template>
	<div ref="wrapper" class="scroll-wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'//导入better-scroll组件
	export default{
		props:{
			probeType:{                  //滚动监听类型
				type:Number,
				default:1
			},
			click:{                      //能否正常的点击
				type:Boolean,
				default:true
			},
			listenScroll:{               //滚动监听
				type:Boolean,
				default:false
			},
			data:{                       //传入数据根据数据实时的去重新计算其滚动高度
				type:Array,
				default:null
			},
			pullup:{                     //是否要打开上拉加载
				type:Boolean,
				default:false
			},
			beforeScroll:{               //滚动之前
				type:Boolean,
				default:false
			},
			refreshDelay:{               //重新刷新的时间
				type:Number,
				default:20
			}
		},
		mounted(){
			setTimeout(()=>{
				this._initScroll()
			},20)
			this.$nextTick(()=>{
				this._initScroll()
			})
		},
		methods:{
			_initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				this.scroll=new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click
				})
				if(this.beforeScroll){
					this.scroll.on('beforeScrollStart',()=>{
						this.$emit('beforeScroll')
					})
				}
				if(this.listenScroll){
					let me=this;
					this.scroll.on('scroll',(pos)=>{
						me.$emit('scroll',pos)
					})
					
				}
				if(this.pullup){                                //判断是否有上拉加载
					this.scroll.on('scrollEnd',()=>{            //滚动结束之后调用该回调函数  派发一次 只调用一次
						if(this.scroll.y <= (this.scroll.maxScrollY+50)){ //判断到滚动到底部
							this.$emit('scrollToEnd')           //滚动到底部了
						}
					})
				}
			},
			disable(){
				this.scroll&&this.scroll.disable()
			},
			enable(){
				this.scroll&&this.scroll.enable()
			},
			refresh(){
				this.scroll&&this.scroll.refresh()
			},
			scrollTo(){
				this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)//这里的scrollTo 是要接受一些参数的 ,所以用apply,传一些参数进去;
			},
			scrollToElement(){
				this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
			
		},
		watch:{
			data(){
				setTimeout(()=>{
					this.refresh()
				},this.refreshDelay)
			}
		}
	}
</script>

<style lang="scss">
	.scroll-wrapper slot{
		position:fixed;
	}

</style>