/**
 * Created by Administrator on 2016/1/22.
 */
(function (pro) {
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = [].slice.call(arguments, 1, 7);
        });
        var format = arguments[0] || "{0}-{1}-{2} {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val && val.length === 1 ? "0" + val : val;
        });
    };
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
})(String.prototype);

var sportHead = document.getElementById("sport-head");
var dayList = document.getElementById("day-list");
var dayListLis = dayList.getElementsByTagName("li");
var sportCnt = document.getElementById("sport-cnt");
var time;

var bindData = function (jsonpdata) {
    var str = "";
    str += "<li class='cur' time=" + jsonpdata[0]["date"] + ">";
    str += "<span class='dl-week'>" + jsonpdata[0]["weekday"] + "</span><br/><span class='dl-time'>" + jsonpdata[0]["date"].myFormatTime("{1}-{2}") + "</span></li>";
    for (var i = 1; i < jsonpdata.length; i++) {
        var cur = jsonpdata[i];
        str += "<li time=" + cur["date"] + ">";
        str += "<span class='dl-week'>" + cur["weekday"] + "</span><br/><span class='dl-time'>" + cur["date"].myFormatTime("{1}-{2}") + "</span></li>";
    }
    dayList.innerHTML = str;
    dayList.style.width = 104 * i + "px";

    time = jsonpdata[0]["date"];
    getDetail();
    bindEvent();
};

var getDetail = function () {
    $.ajax({
        url: "http://matchweb.sports.qq.com/kbs/list?columnId=100000&startTime=" + time + "&endTime=" + time,
        type: "get",
        dataType: "jsonp",
        jsonpCallback: "gameDetail",
        success: function () {
            getGameDetail(arguments[0], time);
        }
    });
};

var getGameDetail = function (gDdata, time) {
    gDdata = gDdata["data"][time];
    var str = "";
    str += "<h2>" + time.myFormatTime("{1}月{2}日") + "</h2><ul class='sport-cnt-ul'>"
    for (var i = 0; i < gDdata.length; i++) {
        var cur = gDdata[i];
        str += "<li><span class='w80 info'>" + cur["startTime"].myFormatTime("{3}:{4}") + "</span>";
        str += "<span class='w140 info'>" + cur["matchDesc"] + "</span>";
        str += "<div class='sign'><img src='" + cur["leftBadge"] + "' alt=''/><span class='sign-name txtleft'>" + cur["leftName"] + "</span></div>";
        str += "<span class='num'>" + cur["leftGoal"] + "-" + cur["leftGoal"] + "</span>";
        str += "<div class='sign'><span class='sign-name txtright'>" + cur["rightName"] + "</span><img src='" + cur["rightBadge"] + "' alt=''/></div>";
        str += "<span class='video txtright'>视频集锦</span></li>";
    }
    str += "</ul>";
    sportCnt.innerHTML = str;
}

function bindEvent() {
    for (var i = 0; i < dayListLis.length; i++) {
        dayListLis[i].onclick = function () {
            for (var j = 0; j < dayListLis.length; j++) {
                dayListLis[j].className = "";
            }
            this.className = "cur";
            time = this.getAttribute("time");
            getDetail();
        }
    }
}
/*
 sportHead.onclick=function(e){
 e=e||window.event;
 var target= e.target|| e.srcElement;
 if(target.id=="leftEar"){

 }else if(target.id="rightEar"){

 }else if(target.tagName.toLowerCase()=="li"){
 for(var i=0;i<dayListLis.length;i++){
 dayListLis[i].className="";
 }
 target.className="cur";
 time=target.getAttribute("time");
 getDetail();
 }
 };*/
