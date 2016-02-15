function EventEmitter(){};
EventEmitter.prototype.on=function(type,fn){
	if(!this[type]){
		this[type]=[];	
	}
	var a=this[type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return ;	
	}
	a.push(fn);
	
}
EventEmitter.prototype.run=function(type,e){
	var a=this[type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e);	
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
}
EventEmitter.prototype.off=function(type,fn){
	var a=this[type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				break;	
			}
		}
	}
}


function Drag(ele){//构造函数，ele表示被拖拽的元素
	this.ele=ele;//把要拖拽的元素保存在当前实例的属性ele上,以便于Drag类的其它方法也可以操作这个被拖拽的元素ele
	this.x=null;//表示把这个属性提前准备好
	this.y=null;
	this.mx=null;
	this.my=null;

	this.DOWN=processThis(this,this.down);
	this.MOVE=processThis(this,this.move);
	this.UP=processThis(this,this.up);
	//on(ele,"mousedown",this.down);//this.down,this.down();
	on(ele,"mousedown",this.DOWN);//事件里的this的原则是：这个方法绑定给谁，当这个方法在执行的时候，this就是谁
	//面向对象的原则是：类上的方法里的this指向的当前实例
	//我们现在的原则是采用面向对象的this的原则：这个类上方法里所有的this都是指的当前类的实例，如果出现的偏差，则用processThis方法解决
}
Drag.prototype=new EventEmitter;
//Drag.prototype.__proto__=EventEmitter.prototype;
Drag.prototype.down=function(e){
	this.x=this.ele.offsetLeft;
	this.y=this.ele.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	
	if(this.ele.setCapture){
		this.ele.setCapture();
		on(this.ele,"mousemove",this.MOVE);
		on(this.ele,"mouseup",this.UP);
	}else{
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
	this.run("dragstart",e);
}
Drag.prototype.move=function(e){
	this.ele.style.left=this.x+(e.pageX-this.mx)+"px";
	this.ele.style.top=this.y+(e.pageY-this.my)+"px";
	
	this.run("drag",e);
}

Drag.prototype.up=function(e){
	if(this.ele.releaseCapture){
		this.ele.releaseCapture();
		off(this.ele,"mousemove",this.MOVE);
		off(this.ele,"mouseup",this.UP);
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
	}
	this.run("dragend",e);
}

