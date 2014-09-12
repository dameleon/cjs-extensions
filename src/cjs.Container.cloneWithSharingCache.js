;(function(cjs) {
'use strict';

var props = [
    'cacheCanvas',
    'cacheID',
    '_cacheWidth',
    '_cacheHeight',
    '_cacheOffsetX',
    '_cacheOffsetY',
    '_cacheScale'
];

/**
 * キャッシュ情報を引き継ぎつつ、新しいシンボルインスタンスを生成する
 *
 * @member createjs.Container
 * @method cloneWithSharingCache
 * @return {Object} Container (or extend it) instance
 */
cjs.Container.prototype.cloneWithSharingCache = function() {
    var mc = this.clone(true);

    if (!this.cacheCanvas) {
      return mc;
    }
    for (var i = 0, p; p = props[i]; i++) {
        mc[p] = this[p];
    }
    return mc;
};
})(createjs);

