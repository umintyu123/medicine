//管理者--イベント管理
//イベント詳細取得
    document.addEventListener('init',function(admin_event_article){
    //取得先データストア選択--article
    var articleData = ncmb.DataStore("article");
    //データストア内検索--イベント詳細内容を取得する
    articleData.order("event_data",true).fetchAll()
    .then(function(results){
        for(var c1 = 0; c1 < results.length; c1++){
            //仮で使うためのvar object
                    var object = results[c1];
            //追加したい要素のid取得
                    var do1 = document.getElementById("admin_event_article"); 
                //ons-card生成
                    var new_ons_card = document.createElement("ons-card");
                //ons-cardの基盤を書く
                            new_ons_card.innerHTML = 
                            '<div id="event_title' + [c1] +'">テストイベント</div>'+
                            '<ons-list-header>イベントの詳細内容</ons-list-header>'+
                            '<ons-list-item >'+
                            '<div>開催日:</div><div id="event_data' + [c1] + '">YYYY年MM月DD日</div>' +
                            '</ons-list-item>'+
                            '<ons-list-item >'+
                            '<div>開催住所:</div><div id="event_address' + [c1] + '">-----</div>'+
                            '</ons-list-item>'+
                            '<ons-list-item>'+
                            '<div>電話番号:</div><div id="event_phone_number' + [c1] + '">080-1234-5678</div>'+
                            '</ons-list-item>'+
                            '<ons-list-item>'+
                            '<div>詳細:</div><div id="event_content' + [c1] + '">--------------------</div>'+
                            '</ons-list-item>'+
                            '<ons-button onclick="fn.load('+'\'artcle_edit.html\''+')" type="submit" modifier="outline">編集</ons-button>'+
                            '<ons-button onclick="notify()" modifier="cta" style="background-color: red;">削除</ons-button>';
                //カード表示
                        do1.appendChild(new_ons_card);
        }
            for (var i = 0; i < results.length; i++){
                //仮で使うためのvar object
                    var object = results[i];
                //開催日取得.isoに日時が入ってる
                    var event_date = object.get('event_date');
                        // //日時の正規表現
                        //     var data = event_date.split(/-|T/,3);
                        // //日時フォーマットの変更
                        //     var day = data[0] +"年"+ data[1] +"月"+ data[2] +"日";
                    //開催日変更
                        var change_event_data = document.getElementById("event_data" + [i]).innerHTML = event_date;
                //開催住所
                    var event_address = object.get("address");
                    //住所の変更
                        var change_event_address = document.getElementById("event_address" + [i]).innerHTML = event_address;
                //電話番号
                    var event_phone_number = object.get("phone_number");
                    //電話番号の変更
                        var change_phone_number = document.getElementById("event_phone_number" + [i]).innerHTML = event_phone_number;
                //詳細
                    var event_content = object.get("content");
                    //イベント詳細内容の変更
                        var change_event_content = document.getElementById("event_content" + [i]).innerHTML = event_content;
            }
        }).catch(function(err){
            console.log(err);
        });
},false);

//イベント管理--イベント新規登録
function admin_add(){
    //入力値取得
        var admin_event_title = document.getElementById("admin_event_title").value;
        var admin_event_day = document.getElementById("admin_event_day").value;
        var admin_event_address = document.getElementById("admin_event_address").value;
        var admin_event_phone = document.getElementById("admin_event_phone").value;
        var admin_event_content = document.getElementById("admin_event_content").value; 
        console.log(admin_event_day+"あああああ");
    //保存先データストア選択
        var admin_add = ncmb.DataStore("article");
        var add = new admin_add();
        add.set("title",admin_event_title)
           .set("event_date",admin_event_day)
           .set("address",admin_event_address)
           .set("phone_number",admin_event_phone)
           .set("content",admin_event_content)
           .save()
           .then(function(){
               console.log("保存成功")
           })
           .catch(function(err){
               console.log(err);
           });
}


//患者検索
function user_list() {
     var currentUser = ncmb.User.getCurrentUser();
     //console.log(currentUser);
    ncmb.Role.equalTo("roleName","patient")
        .fetch()
        .then(function(role){
            console.log(role);
           return role.fetchUser();
          })
        .then(function(users){
            console.log("患者数：" + users.length);
            for (var i = 0; i < users.length; i++) {
              var user = users[i];
              console.log (user.userName);
            }
        })
        .catch(function(err){
            console.log(err);
        });
  }



//患者条件付検索
function user_search() {
    var number = document.getElementById('user_search').value;
    ncmb.User.equalTo("telephone", number)
        .fetchAll()
        .then(function(patient){
            console.log(patient.length);
            console.log(typeof(number));
        })
        .catch(function(error){
            console.log("検索失敗："+JSON.stringify(error));
        })

}


//新規患者登録
function addAlertDialog() {
  var dialog = document.getElementById('alert-add');
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('alert_add.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};
function hideAdd() {
  document
    .getElementById('alert-add')
    .hide();
};


function user_add() {
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var kanaName = document.getElementById("kanaName").value;
    var telephone = document.getElementById("telephone").value;
    var acl = new ncmb.Acl();
    acl.setPublicReadAccess(true)
        .setPublicWriteAccess(true);
    //空白、数字判定の処理　未着手

    var user = new ncmb.User();
    user.set("userName", userName)
        .set("password", password)
        .set("kanaName", kanaName)
        .set("telephone", telephone)
        .set("position","patient")
        .set("acl",acl)
        .signUpByAccount()
        .then(function(){
            console.log("aaaa");
            ncmb.Role.equalTo("roleName","patient")
                .fetch()
                .then(function (role){
                    console.log(role);
                    role.addUser(user)
                        .update()
                        .then(function (){
                            console.log("ロール付与成功")
                        })
                        .catch(function(error) {
                            console.log("ロール付与失敗："+error+JSON.stringify(error));
                        });
                })
                .catch(function (error){
                    console.log("ロール検索失敗："+eeror+JSON.stringify(error));
                });
            console.log("登録成功");
            fn.load('main.html');
            hideAdd();
        })
        .catch(function(error){
            console.log("新規登録失敗:" +error+ JSON.stringify(error));
        });
}


//管理者情報更新
function adminEditAlert() {
  var dialog = document.getElementById('alert-admin');
    if (dialog) {
    dialog.show();
  } else {
    ons.createElement('alert_admin.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};
function hideAdmin() {
  document
    .getElementById('alert-admin')
    .hide();
};

function admin_edit(){
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var currentUser = ncmb.User.getCurrentUser();
    console.log(currentUser);
    currentUser
        .set("userName", userName)
        .set("password", password)
        .update()
        .then(function() {
            // 更新成功時
            console.log("管理者の更新成功");
            window.location.href = "index.html";
        })
        .catch(function(error) {
            // 更新失敗時
            console.log("管理者の更新失敗" + error);
        });
}

//ログアウト
function logoutAlertDialog() {
  var dialog = document.getElementById('alert-logout-dialog');
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


function logout() {
    ncmb.User.getCurrentUser();
    ncmb.User.logout()
        .then(function(user) {
            console.log("ログアウト成功：" + JSON.stringify(user));
            window.location.href = "../index.html";
        })
        .catch(function(error) {
            console.log("ログアウト失敗：" + error + "," + JSON.stringify(error));
        });
}

//削除警告--イベント管理で使用--
function notify() {
    ons.notification.confirm({
        title:'警告',
        message: 'このアカウントを削除しますか',
        buttonLabels: ["いいえ","はい"],

});
  };