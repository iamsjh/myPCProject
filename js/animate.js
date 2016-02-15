/*
 * animate:珠峰培训TWEEN算法动画库,采用惰性思想进行封装,包含了很多的、常用的、高级的运动方式
 * @parameter
 *   curEle:[object]我们当前要操作的元素,让这个元素有运动的效果
 *   options:[object]我们目标位置的样式值
 *   duration:[number]当前动画运动的总时间
 *   effect:[number/array]当期动画运动的方式(选)->默认运动是匀速运动
 *   callback:[function]当前动画运动完成做的事情(选)
 * by Team on 2015/12/23
 */
var animate = (function () {


    //zhufengEffect:珠峰培训TWEEN算法公式
    //t->times 已经运动的时间, b->begin 开始的位置, c->change 总运动距离(结尾的位置-开始的位置), d->duration 总运动时间
    var zhufengEffect = {
        //匀速
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        //指数衰减的反弹缓动
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - zhufengEffect.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2) {
                    return zhufengEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                }
                return zhufengEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        //二次方的缓动
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        //三次方的缓动
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        //四次方的缓动
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        //五次方的缓动
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        //正弦曲线的缓动
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        //指数曲线的缓动
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        //圆形曲线的缓动
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        //超过范围的三次方缓动
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        //指数衰减的正弦曲线缓动
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }
    };

    //实现我们的animate动画库
    return function (curEle, options, duration, effect, callback) {
        //init effect
        var fnEffect = zhufengEffect.Linear;//->默认是匀速的运动
        if (typeof effect === "number") {
            //1->Linear 2->Elastic-easeOut 3->Back-easeOut 4->Bounce-easeOut 5->Expo-easeIn
            var ary = ["Linear", "Elastic-easeOut", "Back-easeOut", "Bounce-easeOut", "Expo-easeIn"];
            for (var i = 0; i < ary.length; i++) {
                if (effect === (i + 1)) {
                    var curItem = ary[i].split("-");
                    var curItemFir = curItem[0];
                    var curItemTwo = curItem[1];
                    fnEffect = curItem.length === 1 ? zhufengEffect[curItemFir] : zhufengEffect[curItemFir][curItemTwo];
                    break;
                }
            }
        } else if (effect instanceof Array) {
            var effectFir = effect[0];
            var effectTwo = effect[1];
            fnEffect = effect.length === 1 ? zhufengEffect[effectFir] : zhufengEffect[effectFir][effectTwo];
        } else if (typeof effect === "function") {
            //我们的第四项的运动方式没有传递,第四个参数的值应该是我们第五个形参callback的值
            callback = effect;
        }

        //init parameter
        var times = 0, interval = 15, oBegin = {}, oChange = {};
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                //key->当前要运动的方式的属性值,例如:"left"、"width"...
                oBegin[key] = utils.getCss(curEle, key);//->获取并且记录当前方向的起始位置的值
                oChange[key] = options[key] - oBegin[key];//->用传递进来当前方向的目标中减去起始的值等于我们当前方向的总距离
            }
        }

        //init
        var move = function () {
            window.clearTimeout(curEle.timer);
            times += interval;//->每一次执行都记录一下当前已经运动的时间
            if (times >= duration) {
                //->已经到达目标位置:运动的时间已经超过总设定的时间
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        utils.setCss(curEle, key, options[key]);
                    }
                }
                typeof callback === "function" ? callback.call(curEle) : null;
                return;
            }
            for (var attr in oChange) {
                if (oChange.hasOwnProperty(attr)) {
                    var curVal = fnEffect(times, oBegin[attr], oChange[attr], duration);
                    utils.setCss(curEle, attr, curVal);
                }
            }
            curEle.timer = window.setTimeout(move, interval);
        };
        move();
    }
})();