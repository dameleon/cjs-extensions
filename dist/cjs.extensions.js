/*! cjs-extensions // @version 0.0.0, @license MIT, @Author dameleon <dameleon@gmail.com> */
!function(t){"use strict";var e=t.Container;e.prototype._getObjectsUnderPoint=function(t,i,n,s,a){var r=createjs.DisplayObject._hitTestContext,o=this._matrix,h=this.children,c=h.length;a=a||s&&this._hasMouseEventListener();for(var l=c-1;l>=0;l--){var u=h[l],f=u.hitArea;if(u.visible&&(f||u.isVisible())&&(!s||u.mouseEnabled))if(!f&&u instanceof e){var d=u._getObjectsUnderPoint(t,i,n,s,a);if(!n&&d)return s&&!this.mouseChildren?this:d}else{if(s&&!a&&!u._hasMouseEventListener())continue;if(u.visible&&u.alpha>0&&f&&f.nominalBounds){var _=f.globalToLocal(t,i),p=f.nominalBounds;if(p.x<=_.x&&_.x<=p.x+p.width&&p.y<=_.y&&_.y<=p.y+p.height){if(n){n.push(u);continue}return s&&!this.mouseChildren?this:u}continue}if(u.getConcatenatedMatrix(o),f&&(o.appendTransform(f.x,f.y,f.scaleX,f.scaleY,f.rotation,f.skewX,f.skewY,f.regX,f.regY),o.alpha=f.alpha),r.globalAlpha=o.alpha,r.setTransform(o.a,o.b,o.c,o.d,o.tx-t,o.ty-i),(f||u).draw(r),!this._testHit(r))continue;if(r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,2,2),!n)return s&&!this.mouseChildren?this:u;n.push(u)}}return null}}(createjs),function(t){"use strict";var e=["cacheCanvas","cacheID","_cacheWidth","_cacheHeight","_cacheOffsetX","_cacheOffsetY","_cacheScale"];t.Container.prototype.cloneWithSharingCache=function(){var t=this.clone(!0);if(!this.cacheCanvas)return t;for(var i,n=0;i=e[n];n++)t[i]=this[i];return t}}(createjs),function(t){"use strict";function e(e,i,n){var s=this,a=this.timeline=e.timeline,r=this.endPosition=a.resolve(i+"_end");if(null===r)throw new Error("Undefined end position label.");var o=function(){s.finish(!0)};this.mc=e,this.finished=!1,this.callback=n,this.tween=t.Tween.get(e).wait(r).call(o),a.addTween(this.tween)}var i=t.MovieClip.prototype;i.gotoAndPlayWithCallback=function(t,i){if(!i)return this.gotoAndPlay(t);if("string"!=typeof t)throw new TypeError("Argument type error. argument 1 must be string when argument 2 passed.");var n=this,s=this.timeline;return this.gotoAndPlay(t),s.__cb=new e(this,t,function(){s.__cb=null,i.call(n)}),this},i.__originalGoto=i._goto,i._goto=function(t){var e=this.timeline,i=e.__cb;i&&(e.__cb=null,i.finish(!0)),this.__originalGoto(t)},e.prototype={finish:function(t){this.finished||(this.finished=!0,this.timeline.removeTween(this.tween),(!t||t&&this.timeline.position===this.endPosition)&&this.callback())}}}(createjs);