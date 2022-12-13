//写真撮影あり
function takePicture() {
    var options = {
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL
    };
    navigator.camera.getPicture(onSuccess, onError, options);

    function onSuccess(imageData){
        //画像の圧縮又は解像度を下げる作業をする
        // ncmbに画像をアップロード
        var fileName = makeUUID() + ".jpg";
        var fileData = toBlob(imageData, "image/jpeg");
        ncmb.File.upload(fileName, fileData)
            .then(function(result){
                alert("画像アップロード成功");

                // 撮影した画像を画面に表示
                var image = document.getElementById("photo");
                image.src = "data:image/jpeg;base64," + imageData;
                // ★2.でコードを追加します
            })
            .catch(function(error){
                alert("画像アップロード失敗" + error);
            });
    }
    // 撮影キャンセル
    function onError(message){
        alert("エラー: " + message);
    }
}

// Blobを作成
function toBlob(base64, mime_type) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }

    try{
        var blob = new Blob([buffer.buffer], {
            type: mime_type
        });
    }catch (e){
        return false;
    }
    return blob;
}

// UUID生成
function makeUUID() {
    var d = + new Date();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}