cjs-extensions
==============

## createjs.MovieClip.gotoAndPlayWithCallback

命名規則に従った特定のラベル間を再生し、終了ラベル到達時に callback を発火します。

命名規則は、 **終了ラベルにおいて {再生ラベル}_end となるように _end をつけておく** これだけです。

**注意**

- createjs.MovieClip オブジェクトを拡張するので、Container 等には上記のメソッドは生えません

```javascript
// someMC には play, play_end というラベル名が付いているとする 
someMC.gotoAndPlayWithCallback('play', function() {
    // play_end に到達した瞬間に実行される    
});
```


## createjs.Container.cloneWithSharingCache

シンボルを clone する際に、対象のシンボルのキャッシュ情報を引き継いだシンボルを生成します。

これにより、同一のシンボルでもキャッシュが別、というようなことが起こりづらくなるため、より省メモリにシンボルを生成することができます。

**注意**

- createjs.Container オブジェクトを拡張するので、 Container オブジェクトから拡張される MovieClip などでもメソッドが使用できます 
- キャッシュ情報を共有しているシンボルのいずれかでキャッシュの更新を行うと、全てのシンボルの描画情報が更新されます

```javascript
var newMC = someMC.cloneWithSharingCache();

// キャッシュ情報は同一なので true となる
console.log(newMC.cacheID === someMC.cache);
```


## createjs.Container._getObjectsUnderPoint

[この記事](http://qiita.com/damele0n/items/e9c36524e18b0f38a079) の通り、iOS7 on iPhone4 では hitArea に対する hitTest が上手く動作しません。

このコードで修正は可能ですが、下記のリスクを抱えるので注意してください

- hitArea が何らかの方法で変形されてる(scale がかかってる)とうまくいかないかもしれない
- 矩形の範囲しか指定できない = hitTest が全部矩形で判断されてしまう

この方法以外では、現状は逃げ道がありません。

iOS7 on iPhone4 のサポートを切ることも視野に入れてください。


