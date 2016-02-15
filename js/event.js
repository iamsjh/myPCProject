function on(ele,type,fn){//创建数组并且把fn保存到数组里
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;//如果是标准浏览器，用addEventListener绑定完事件之后，直接退出就可以了
	}
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];//这个数组，如果事件类型相同，它只会创建一次。也就是相同的事件类型，这行代码只会执行一次	
		ele.attachEvent("on"+type,function(){run.call(ele)});//这一行代码就取代bind了
	}
	for(var i=0;i<ele["aEvent"+type].length;i++){
		if(ele["aEvent"+type][i]==fn)return;
	}
	
	ele["aEvent"+type].push(fn);

}

function run(){
	var e=window.event;
	var type=e.type;
	var a=this["aEvent"+type];//this是被绑定的那个DOM元素
	if(!e.target){
		e.target=e.srcElement;
		e.preventDefault=function(){e.returnValue=false;}
		e.stopPropagation=function(){e.cancelBubble=true;}
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		
	}
	if(a)//这是在判断数组a是否存在
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);	
			}else{
				a.splice(i,1);
				i--;
			}
		}
		
}

function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
		return;	
	}
	var a=ele["aEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				break;	
			}
		}
	}
}

function processThis(obj,fn){//fn.bind的实现原理
	return function(e){fn.call(obj,e)}
}
