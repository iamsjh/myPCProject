/**
 * Created by Administrator on 2016/1/9.
 */
(function () {
    //搜索框的js
    var search = document.getElementById('j-search');
    var oInput = search.getElementsByTagName('input')[0];
    var searchList = document.getElementById('j-searchList');
    var searchListAs = utils.getElementsByClass('j-search-cnt', searchList);
    /*var searchListPosi = {}, searchWidth = null, searchHeight = null;*/
    oInput.onfocus = oInput.onkeyup = function () {
        var val = oInput.value.replace(/(^ +| +$)/g, "");
        if (val.length > 0) {
            searchList.style.display = "block";
        } else {
            searchList.style.display = "none";
        }
    };

    document.body.onclick = function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        if (e.target.parentNode.parentNode.id == "j-search" && e.target.tagName.toLowerCase() == "input") {
            return;
        } /*else if (e.pageX > searchListPosi.left && e.pageX < (searchListPosi.left + searchWidth) && e.pageY > searchListPosi.top && e.pageY < (searchListPosi.top + searchHeight)) {//可以用阻止冒泡
            return;
        } */else {
            searchList.style.display = "none";
        }
    };
    searchList.onclick=function(e){//阻止搜索列表的事件冒泡
        e=e||window.event;
        e.stopPropagation();
        e.cancelBubble=false;
    };
    function searchShow() {
        for (var i = 0; i < searchListAs.length; i++) {
            var cur = searchListAs[i];
            cur.index = i;
            cur.onclick = function () {
                oInput.value = this.getAttribute("data-value");
                searchList.style.display = "none";
            }
        }
    }
    searchShow();

    //页面右侧导航的右下角小动画
    var sideNav = document.getElementById('j-sideNav');
    var sphone = utils.getElementsByClass('sphone', sideNav)[0];
    var sphoneA = utils.getElementsByClass('j-sphone', sideNav)[0];
    var sphonePop = utils.getElementsByClass('j-sphone-pop', sideNav)[0];
    sphoneA.step = 0;
    sphone.onmouseover = function () {
        window.clearInterval(sphoneA.autotimer);
        sphoneA.autotimer = window.setInterval(function () {
            move.call(sphoneA, 'over');
        }, 100);
        sphoneA.brother = sphonePop;

    };
    sphone.onmouseout = function () {
        window.clearInterval(sphoneA.autotimer);
        sphoneA.autotimer = window.setInterval(function () {
            move.call(sphoneA, 'out');
        }, 100);
    };
    function move(flag) {
        if (flag == "over") {
            this.step += 80;
            if (this.step > 1200) {
                this.style.backgroundPositionX = -720 + "px";
                this.step = 720;
            }
            if (this.step == 720 && this.brother && utils.getCss(this.brother, 'display') == "none") {
                this.brother.style.display = "block";
                animate(this.brother, {'opacity': 1}, 10);
            }
        } else if (flag = "out") {
            this.step -= 80;
            if (this.step <= 0) {
                window.clearInterval(this.autotimer);
                this.style.backgroundPositionX = 0 + "px";
                return;
            }
            if (this.brother && utils.getCss(this.brother, 'display') == "block") {
                this.brother.style.display = "none";
            }
        }
        animate(this, {'background-position-x': -this.step}, 10);
    }

    //页面右侧导航锚记变化：绑定滚轮事件，当movie板块距离浏览器上边缘的高度>movie上一个板块距离浏览器的上边缘的高度时，则当前描点指向movie板块，否则继续留在movie的上一板块。默认是高亮显示第一个
    var sNavlist = utils.getElementsByClass("sNavlist", document.body)[0];
    var sidenavAs = sNavlist.getElementsByTagName("a");
    var sidenavlis = sNavlist.getElementsByTagName("li");
    //固定右侧导航
    var banner = utils.getElementsByClass("banner", document)[0];

    on(window,"scroll",fixNav());

    function fixNav() {
        var bannerTop = utils.offset(banner).top,
            bannerHeight = utils.getCss(banner, "height"),
            winH = document.documentElement.clientHeight || document.body.clientHeight,
            sidenavH = utils.getCss(sideNav, "height"),
            sTop2 = (winH - sidenavH) / 2 > 0 ? (winH - sidenavH) / 2 : 0;
        return function(){
            var sTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (sTop >= bannerHeight) {
                sideNav.style.top = sTop2 + "px";
            } else {
                sideNav.style.top = bannerTop + "px";
            }
        };
        /*window.onscroll=function(){
         var sTop=document.documentElement.scrollTop||document.body.scrollTop;
         if(sTop>=bannerHeight){
         sideNav.style.top=sTop2+"px";
         }else{
         sideNav.style.top=bannerTop+"px";
         }

         };*/
    }
    fixNav()();


    //侧导航，跳转锚记
    function sidenavAchor() {
        for (var i = 0; i < sidenavAs.length; i++) {
            var cur = sidenavAs[i];
            cur.onclick = function () {
                if(!sSortA.drag){
                    var name = this.getAttribute("name");
                    var ele = document.getElementById("j-" + name);
                    if (ele) {
                        var offsetTop = utils.offset(ele).top;
                        document.documentElement.scrollTop = offsetTop;
                        document.body.scrollTop = offsetTop;
                    }
                }
            }
        }
    }

    sidenavAchor();

    //高亮显示当前区域所表示的按钮,绑定滚轮事件
    function curNav() {
        for (var i = 0; i < sidenavAs.length; i++) {
            var cur = sidenavAs[i],
                name = cur.getAttribute("name"),
                ele = document.getElementById("j-" + name);
            cur.eleTop = utils.offset(ele).top;
        }
        on(window, "scroll", function () {
            if(!sSortA.drag){
                var sTop = document.documentElement.scrollTop || document.body.scrollTop;
                for (i = 0; i < sidenavAs.length; i++) {
                    utils.removeClass(sidenavAs[i], "cur");
                }
                for (i = 0; i < sidenavAs.length - 1; i++) {
                    cur = sidenavAs[i];
                    if (cur.eleTop < sTop && sidenavAs[i + 1].eleTop > sTop) {
                        var curLong = sTop - cur.eleTop,
                            curNextLong = sidenavAs[i + 1].eleTop - sTop;
                        curLong <= curNextLong ? (utils.addClass(cur, "cur")) : (utils.addClass(sidenavAs[i + 1], "cur"));
                        return;
                    }
                    if (cur.eleTop >= sTop && sTop > 200) {
                        utils.addClass(cur, "cur");
                        return;
                    }
                }
            }

        });

    }

    curNav();
    //浏览器窗口改变时，也会影响侧边导航的计算，啊啊啊

    //导航排序
    var sSort = utils.getElementsByClass("sSort", sideNav)[0];
    var sNavBg=utils.getElementsByClass("sNavBg",sideNav)[0];
    var sNavBgImg=utils.getElementsByClass("sNavBgImg",sideNav)[0];
    var bigBg=utils.getElementsByClass("bigBg",document.body)[0];
    var sSortA = utils.children(sSort, "a")[0];
    sSortA.drag=false;
    bigBg.onclick=sSortA.onclick = function () {
        bindNavSort.call(this);
    }
    //排序绑定事件函数
    function bindNavSort(){
        if (utils.hasClass(sSortA, "cur")) {
            sSortA.drag=false;
            for (var i = 0; i < sidenavlis.length; i++) {
                sidenavlis[i].style.position = "static";
            }
            utils.removeClass(sSortA, "cur");
            bigBg.style.display="none";
            sNavBg.style.display="none";
            sNavBgImg.style.display="none";
        } else {
            sSortA.drag=true;
            for(var i=0;i<sidenavAs.length;i++){
                utils.removeClass(sidenavAs[i],"cur");
            }
            sortNav();
            utils.addClass(sSortA, "cur");
            bigBg.style.display="block";
            sNavBg.style.display="block";
            sNavBgImg.style.display="block";
        }
    }

    //拖拽排序的主体
    function sortNav() {
        sSortA.index = 0;
        for (var i = sidenavlis.length - 1; i >= 0; i--) {
            var oLi = sidenavlis[i];
            oLi.style.top = (oLi.t = oLi.offsetTop) + "px";
            oLi.style.left = (oLi.l = oLi.offsetLeft) + "px";
            oLi.style.position = "absolute";//定位要后做
            oLi.style.margin = 0;
            var obj = new Drag(oLi);
            obj.on("dragstart", increaseIndex);//让被拖拽的元素在最上面
            obj.on("drag", getHited);
            obj.on("drag", changePosition);
            obj.on("dragend", goHome);
            obj.on("dragend", changePart);
        }
    }

    function increaseIndex() {
        this.ele.style.zIndex = ++sSortA.index;
    }

    function goHome() {
        /*console.log(this.ele.l,this.ele.t,this.ele.changeIndex);*/
        animate(this.ele, {left: this.ele.l, top: this.ele.t}, 100, 2);
    }

    function getHited() {//此方法对撞上的元素进行处理：加黄背景并且保存
        var ele = this.ele;//这是当前被拖拽的元素
        this.aHited = [];
        for (var i = 0; i < sidenavlis.length; i++) {
            var oLi = sidenavlis[i];
            if (ele == oLi)continue;//自己不和自己做碰撞检测
            if (test(ele, oLi)) {
                this.aHited.push(oLi);//把撞上的保存到数组里
                oLi.index=i;
            }
        }

    }

    function test(r, b) {
        if (r.offsetLeft + r.offsetWidth/2 < b.offsetLeft || r.offsetTop + r.offsetHeight/2 < b.offsetTop || r.offsetLeft > b.offsetLeft + b.offsetWidth/2 || r.offsetTop > b.offsetTop + b.offsetHeight/2) {
            return false;//以上情况是没有撞上的
        } else {
            return true;
        }
    }

    //red,blue

    //用来交换位置的方法
    function changePosition() {
        var a = this.aHited;
        if (a.length!==0) {
            for (var i = 0; i < a.length; i++) {
                var oLi = a[i];
                var ele = this.ele;
                oLi.distance = Math.pow(oLi.offsetLeft - ele.offsetLeft, 2) + Math.pow(oLi.offsetTop - ele.offsetTop, 2);

            }
            a.sort(function (a, b) {
                return a.distance - b.distance;
            });
            oLi = a[0];
            animate(oLi, {left: ele.l, top: ele.t}, 100, 4);
            /*utils.setGroupCss(ele, {left: oLi.l, top: oLi.t});*/

            var templ = ele.l;
            var tempt = ele.t;
            ele.l = oLi.l;
            ele.t = oLi.t;
            oLi.l = templ;
            oLi.t = tempt;
            ele.changeIndex=oLi.index;

        }
        this.aHited = null;
    }
    //交换页面内容
    function changePart(){
        if(this.ele.changeIndex){
            var frg=document.createDocumentFragment(),frg2=document.createDocumentFragment(),contentRow=utils.getElementsByClass("contentRow",document);
            //修改侧导航代码顺序,insertBefore和appendChild是插入元素，如果元素存在的话，则对其重新进行排序，且其原来的效果不受影响
            sidenavlis[0].parentNode.insertBefore(this.ele,sidenavlis[this.ele.changeIndex+1]);
            //修改页面代码顺序
            var name=utils.children(this.ele,"a")[0].getAttribute("name");
            var target=document.getElementById("j-"+name);
            contentRow[this.ele.changeIndex].parentNode.insertBefore(target,contentRow[this.ele.changeIndex+1]);
        }
    }


    //回到顶部
    var sBackBtn=utils.getElementsByClass("sbackBtn",sideNav)[0];
    sBackBtn.onclick=function(){
        goBackTop();
    }
    function goBackTop(){
        var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
        if(scrollT<=0){return;}
        document.documentElement.scrollTop=document.body.scrollTop=0;
        /*animate(document.body,{scrollTop:0},10);*/
    }

})();