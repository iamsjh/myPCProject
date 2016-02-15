/**
 * Created by Administrator on 2016/1/6.
 */
~function () {
    /*头部鼠标滑过，下拉子元素显示或隐藏*/
    /*头部左侧-鼠标滑过效果*/
    var headLeft = document.getElementById("j-head-left");
    var lis = utils.children(headLeft, "li");
    for (var i = 0; i < lis.length; i++) {
        bindHead(lis[i], "j-head-pop");
    }

    /*头部右侧-鼠标滑过效果*/
    var headRight = document.getElementById("j-head-right");
    var divs = utils.children(headRight, "div");
    for (var i = 0; i < divs.length; i++) {
        bindHead(divs[i], "j-head-pop");
    }

    /*导航列表-鼠标滑过效果*/
    var navList = document.getElementById("j-navlist");
    var navLis = utils.children(navList, "li");
    for (var i = 0; i < navLis.length; i++) {
        bindHead(navLis[i], "aList");
    }

    /*右侧排行榜-鼠标滑过效果*/
    var movie = document.getElementById("j-movie");
    var mrMores = utils.getElementsByClass("mrMore", document);
    for (var i = 0; i < mrMores.length; i++) {
        bindHead(mrMores[i], "moreList");
    }

    //鼠标滑过效果：显示&隐藏同级浮层函数
    function bindHead(curELe, className) {
        var childs = utils.children(curELe);
        if(childs){
            for (var j = 0; j < childs.length; j++) {
                if (utils.hasClass(childs[j], className)) {
                    curELe.index = j;
                    curELe.childs = childs;
                    curELe.onmouseover = function () {
                        this.childs[this.index].style.display = "block";
                        utils.addClass(this, "hover");
                    };
                    curELe.onmouseout = function () {
                        this.childs[this.index].style.display = "none";
                        utils.removeClass(this, "hover");
                    };
                    break;
                }
            }
        }
    }

    /*焦点图*/
    var banner = document.getElementById("j-banner");
    var bannerCnt = document.getElementById("j-bannercnt");
    var bcImg = document.getElementById("j-bcImg");
    var imgList = utils.children(bcImg, "li");
    var imgW = utils.getCss(imgList[0], "width");
    var bcSign = document.getElementById("j-bcSign");
    var signList = utils.children(bcSign, "li");
    ~function () {
        var step = 1;
        utils.setCss(bcImg, "width", (imgList.length + 2) * imgW);
        function move(dir) {
            if (typeof dir == "undefined") {
                step++;
                if (step > imgList.length - 1) {
                    utils.setCss(bcImg, "marginLeft", -imgW);
                    step = 2;
                }
            } else if (dir == "tip") {
                step = this.index + 1;
            }
            animate(bcImg, {marginLeft: -step * imgW}, 200);
            setTip(step - 1);
        }

        bcImg.autotimer = window.setInterval(move, 5000);

        function setTip(index) {
            index >= signList.length ? index = 0 : null;
            index < 0 ? index = signList.length : null;
            for (var i = 0; i < signList.length; i++) {
                if (i == index) {
                    utils.addClass(signList[i], "cur");
                    continue;
                }
                utils.removeClass(signList[i], "cur");
            }
        }

        bannerCnt.onmouseover = function () {
            window.clearInterval(bcImg.autotimer);
        };
        bannerCnt.onmouseout = function () {
            bcImg.autotimer = window.setInterval(move, 3000);
        };

        for (var i = 0; i < signList.length; i++) {
            signList[i].index = i;
            signList[i].onclick = function () {
                move.call(this, "tip");
            }
        }

    }();

    /*选项卡*/
    /*各频道主内容选项卡*/
    var contentRowBodies = utils.getElementsByClass("contentRowBody");
    var crhTabs = utils.getElementsByClass("crhTab");
    ~function(){
       for(var i=0;i<crhTabs.length;i++){
           var mhlChilds = utils.children(crhTabs[i], "a");
           var mbchilds = utils.getElementsByClass("mbCnt", contentRowBodies[i]);
           if(mhlChilds.length>1){
               changeTab(mhlChilds, mbchilds);
           }
       }
    }();

    //各频道右侧选项卡
    var contentRowRanks = utils.getElementsByClass("contentRowRank");
    var crrTabs = utils.getElementsByClass("crrTab");
    ~function(){
        for(var i=0;i<crrTabs.length;i++){
            var mTChilds = utils.children(crrTabs[i], "a");
            var mRankChilds = utils.getElementsByClass("rankCnt", contentRowRanks[i]);
            if(mTChilds.length>1){
                changeTab(mTChilds, mRankChilds);
            }
        }
    }();

    //切换面板函数
    function changeTab(tab, tabCnt) {
        for (var i = 0; i < tab.length; i++) {
            tab[i].index = i;
            tab[i].onclick = function () {
                if (!utils.hasClass(this, "cur")) {
                    for (var j = 0; j < tabCnt.length; j++) {
                        utils.removeClass(tab[j], "cur");
                        utils.setCss(tabCnt[j], "display", "none");
                    }
                    utils.addClass(this, "cur");
                    utils.setCss(tabCnt[this.index], "display", "block");
                }
            }
        }
    }


    //各频道小方块，鼠标滑过显示outBox
    var outBox = utils.getElementsByClass("outBox", document.body)[0];
    for(var j=0;j<contentRowBodies.length;j++){
        var movieLis = utils.getElementsByClass("liTemp", contentRowBodies[j]);
        for(var i=0;i<movieLis.length;i++){
            var cur = movieLis[i];
            cur.index = i;
            cur.onmouseover =function(){
                outBoxShow.call(this);
                danmuShow.call(this);
            };
            cur.onmouseout=function(){
                outBoxhide.call(this);
                danmuhide.call(this);
            }

        }

    }

    //各频道右侧排行，鼠标滑过显示outBox
    for(var j=0;j<contentRowRanks.length;j++){
        var movieRankLis = utils.getElementsByClass("rcLi", contentRowRanks[j]);
        for(var i=0;i<movieRankLis.length;i++){
            var cur = movieRankLis[i];
            cur.index = i;
            if(!utils.hasClass(cur,"liLast")){
                cur.onmouseover =outBoxShow;
                cur.onmouseout=outBoxhide;
            }
        }
    }

    //显示全局outBox浮层函数
    function outBoxShow() {
        this.posi = utils.offset(this);//当鼠标滑过时，计算位置，因为每个图片数量不确定，如果有一万个，在外面计算一万个……
        var outBoxHeight = utils.getCss(outBox, "height");
        outBox.style.display = "block";
        outBox.style.left = this.posi.left + "px";
        outBox.style.top = this.posi.top - outBoxHeight - 5 + "px";
    }
    function outBoxhide(){
        outBox.style.display = "none";
    }


    //弹幕（设置left值为180，如果浏览器不支持，也不会干扰页面）
    function danmuShow(){
        var danmuEles=utils.getElementsByClass("danmu",this);
        for(var i=0;i<danmuEles.length;i++){
           utils.addClass(danmuEles[i],"fake_danmu_gen_"+i);
        }
    }
    function danmuhide(){
        var danmuEles=utils.getElementsByClass("danmu",this);
        for(var i=0;i<danmuEles.length;i++){
            utils.removeClass(danmuEles[i],"fake_danmu_gen_"+i);
        }
    }
    function danmuSlide(){
        //未完待续
        //计算样式，添加动态样式，并利用时间计算循环滚动
    }


}();

