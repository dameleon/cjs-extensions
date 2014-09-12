;(function(cjs) {
'use strict';

var Container = cjs.Container;

/**
 * hitArea が設定されたムービークリップの getObjectsUnderPoint の処理速度を改善する
 * また、iOS7 on iPhone4 での hitArea の計算バグも直します
 *
 * @method _getObjectsUnderPoint
 * @member createjs.Container
 * @param {Number} x
 * @param {Number} y
 * @param {Array} arr
 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
 * @param {Boolean} activeListener If true, there is an active mouse event listener.
 * @return {Array}
 */
Container.prototype._getObjectsUnderPoint = function(x, y, arr, mouse, activeListener) {
	var ctx = createjs.DisplayObject._hitTestContext;
	var mtx = this._matrix;
	var children = this.children;
	var l = children.length;

	activeListener = activeListener || (mouse&&this._hasMouseEventListener());

	for (var i=l-1; i>=0; i--) {
		var child = children[i];
		var hitArea = child.hitArea;

		if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }

		// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO: > だそうです
		if (!hitArea && child instanceof Container) {
			var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener);
			if (!arr && result) { return (mouse && !this.mouseChildren) ? this : result; }
		} else {
			if (mouse && !activeListener && !child._hasMouseEventListener()) { continue; }

            // 対象のシンボルが visible: true、かつ alpha > 0( = オブジェクトが見えている状態で)、かつそのシンボルに hitArea が設定されていた場合
            // hitArea の情報を元に hitTest を行う
            if (child.visible && child.alpha > 0 && hitArea && hitArea.nominalBounds) {
                // イベントの座標を hitArea のローカル座標に直して、x, y の四辺の座標と比較する
                var localRect = hitArea.globalToLocal(x, y);
                var nominalBounds = hitArea.nominalBounds;

                if ((nominalBounds.x <= localRect.x && localRect.x <= (nominalBounds.x + nominalBounds.width)) &&
                    (nominalBounds.y <= localRect.y && localRect.y <= (nominalBounds.y + nominalBounds.height))) {
                        // 配列タイプだったらここで push して返る
			            if (arr) {
                            arr.push(child);
                            continue;
                        }
                        // 直接シンボルを返す
                        else {
                            return (mouse && !this.mouseChildren) ? this : child;
                        }
                }
                // 範囲内に存在しなかったことは確認できてるので、ここで返る
                continue;
            }

            // 通常の処理
			child.getConcatenatedMatrix(mtx);

			if (hitArea) {
				mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
				mtx.alpha = hitArea.alpha;
			}
			ctx.globalAlpha = mtx.alpha;
			ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
			(hitArea||child).draw(ctx);
			if (!this._testHit(ctx)) {
                continue;
            }
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, 2, 2);
			if (arr) {
                arr.push(child);
            } else {
                return (mouse && !this.mouseChildren) ? this : child;
            }
		}
	}
	return null;
};
})(createjs);

