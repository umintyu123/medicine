//イベント詳細取得--ログイン前・後どちらも
    document.addEventListener('init',function(event_all){
    //取得先データストア選択--article
    var articleData = ncmb.DataStore("article");
    //簡易版id取得
    var event_simple = document.getElementById("event_simple");
    //完全版id詳細取得
    var event_all = document.getElementById("event_all");

    //データストア内検索--イベント詳細内容を取得する
    articleData.order("event_data",true).fetchAll()
    .then(function(results){
        if(event_all != null){
            for (var i=0; i<results.length; i++){
                //仮で使うためのvar object
                    var object = results[i];
                //開催日取得.isoに日時が入ってる
                    var event_date = object.get('event_date');
                        // //日時の正規表現
                        //     var data = event_date.split(/-|T/,3);
                        // //日時フォーマットの変更
                        //     var day = data[0] +"年"+ data[1] +"月"+ data[2] +"日";
                    //開催日時変更
                        var change_event_data = document.getElementById("event_data").innerHTML = event_date;
                //開催住所
                    var event_address = object.get("address");
                    //住所の変更
                        var change_event_address = document.getElementById("event_address").innerHTML = event_address;
                //電話番号
                    var event_phone_number = object.get("phone_number");
                    //電話番号の変更
                        var change_phone_number = document.getElementById("event_phone_number").innerHTML = event_phone_number;
                //詳細
                    var event_content = object.get("content");
                    //イベント詳細内容の変更
                        var change_event_content = document.getElementById("event_content").innerHTML = event_content;
                }
            }else if(event_simple != null){
                for (var i=0; i<results.length; i++){
                //仮で使うためのvar object
                    var object = results[i];
                //イベントタイトル取得
                    var event_title = object.get('title');
                    //イベントタイトル変更
                    var change_event_title = document.getElementById("home_title").innerHTML = event_title;
                //開催日取得に日時が入ってる
                    var event_date = object.get('event_date');
                        // //日時の正規表現
                        // var data = event_date.split(/-|T/,3);
                        // //日時フォーマットの変更
                        // var day = data[0] +"年"+ data[1] +"月"+ data[2] +"日";
                    //開催日変更
                    var change_event_data = document.getElementById("home_event_data").innerHTML = event_date;
                //詳細
                    var event_content = object.get("content");
                    //イベント詳細内容の変更
                    var change_event_content = document.getElementById("home_event_content").innerHTML = event_content;
                }
            }
        })
},false);


//ログイン
function login() {
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    ncmb.User.login(userName,password)
        .then(function(user) {
            if(ncmb.User.getCurrentUser()){
                var currentUser = ncmb.User.getCurrentUser();
                console.log(currentUser);
                if(currentUser.position == "patient"){
                    console.log("患者ユーザ");
                    window.location.href = "index.html";
                }
                else if(currentUser.position == "admin"){
                    console.log("管理者ユーザ");
                    window.location.href = "admin/index.html";
                }
            }
        })
        .catch(function(error) {
            console.log("ログイン失敗：" + error + "," + JSON.stringify(error));
            ons.notification.alert('ログインできませんでした');
        });
}


function proc(){
    var currentUser = ncmb.User.getCurrentUser();
    var login_btn = document.getElementById('login_btn');
    var logout_btn = document.getElementById('logout_btn');
    if (currentUser) {
        login_btn.hidden = true;
        logout_btn.hidden = false;
        console.log("ログイン中のユーザー: " + currentUser.get("userName"));
    } else {
        login_btn.hidden = false;
        logout_btn.hidden = true;
        console.log("未ログインまたは取得に失敗");
    }
}

//ログアウト-ダイアログ
function logoutAlert() {
  var dialog = document.getElementById('alert-logout');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('alert_logout.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};

function hideLogoutDialog() {
  document
    .getElementById('alert-logout')
    .hide();
};

//ログアウト
function logout() {
    ncmb.User.getCurrentUser();
    ncmb.User.logout()
        .then(function(user) {
            console.log("ログアウト成功：" + JSON.stringify(user));
            window.location.href = "index.html";
        })
        .catch(function(error) {
            console.log("ログイン失敗：" + error + "," + JSON.stringify(error));
            ons.notification.alert('ログアウトできませんでした');
        });

}

//イベントデータ取得
function ArticleData() {
        var articleData = ncmb.DataStore("article");
        articleData.fetchAll()
            .then(function(results){
                console.log("取得成功：" + JSON.stringify(results));
            })
            .catch(function(error){
                console.log("取得失敗：" + error +", " + JSON.stringify(error));
            });
} 