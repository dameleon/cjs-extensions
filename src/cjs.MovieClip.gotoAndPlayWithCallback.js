;(function(cjs) {
'use strict';

var p = cjs.MovieClip.prototype;

/**
 * 特定の命名規則に従ったフレームラベル間を gotoAndPlay し、終了ラベルでコールバックを発火するメソッド
 *
 *     @example
 *     設定ラベルは
 *         - 開始: hoge
 *         - 終了: hoge_end
 *     のように、開始の名前 + '_end' という命名規則にする
 *     あとは、コード内で
 *
 *     this.gotoAndPlayWithCallback('hoge', function() {});
 *
 *     のようにすれば、終了時に callback が発火して処理は終了する
 *
 * @member createjs.MovieClip
 * @method gotoAndPlayWithCallback
 * @param  {String}   label    再生を開始するラベル名
 * @param  {Function} callback 終了ラベルで発火させる callback 関数
 * @return {Object}   MovieClip instance
 */
p.gotoAndPlayWithCallback = function(label, callback) {
    if (!callback) {
        return this.gotoAndPlay(label);
    } else if (typeof label !== 'string') {
        throw new TypeError("Argument type error. argument 1 must be string when argument 2 passed.");
    }
    var that = this;
    var timeline = this.timeline;

    this.gotoAndPlay(label);
    timeline.__cb = new CallbackHandler(this, label, function() {
        timeline.__cb = null;
        callback.call(that);
    });
    return this;
};

// オリジナルの _goto メソッドを一旦他の場所へ
p.__originalGoto = p._goto;
// _goto をオーバーライドして、timeline に callback が登録されているかどうかを見てあげる
p._goto = function(positionOrLabel) {
    var timeline = this.timeline;

    // __cb が登録されているかをチェック
    // 存在すれば gotoAndPlayWithCallback の最中に呼ばれたことになる
    var __cb = timeline.__cb;

    if (__cb) {
        // 先に消しておく
        timeline.__cb = null;
        // isCancel = true にして finish を呼ぶ
        __cb.finish(true);
    }
    this.__originalGoto(positionOrLabel);
};

/**
 * gotoAndPlayWithCallback 用のコールバック管理用オブジェクト
 *
 * @class CallbackHandler
 * @private
 * @param {Object}   mc       createjs.MovieClip インスタンス
 * @param {String}   label    開始ラベル名
 * @param {Function} callback 終了時に発火するコールバック
 */
function CallbackHandler(mc, label, callback) {
    var that = this;
    var timeline = this.timeline = mc.timeline;
    // 終了ラベルを取得
    var endLabelPos = this.endPosition = timeline.resolve(label + '_end');
    //
    // 終了ラベルが定義されていなかったら、ここでエラー吐いて返る
    if (endLabelPos === null) {
        throw new Error('Undefined end position label.');
    }
    var cb = function() {
        that.finish(true);
    };

    this.mc = mc;
    this.finished = false;
    this.callback = callback;
    this.tween = cjs.Tween.get(mc).wait(endLabelPos).call(cb);
    timeline.addTween(this.tween);
}

CallbackHandler.prototype = {
    /**
     * コールバックの終了処理を行う
     *
     * @member CallbackHandler
     * @method finish
     * @param {Boolean} [isCancel]
     *      キャンセルとして呼ばれたかどうかのフラグ
     */
    finish: function(isCancel) {
        // 念のため
        if (this.finished) {
            return;
        }
        this.finished = true;
        // tween を消しておく
        this.timeline.removeTween(this.tween);
        // isCancel が立ってない、もしくは isCance だけど現在の timeline.position が endPosition だったら callback を呼ぶ
        if (!isCancel || (isCancel && this.timeline.position === this.endPosition)) {
            this.callback();
        }
    }
};

})(createjs);
