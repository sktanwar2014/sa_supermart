function generateAccountId(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text+Math.round(+new Date()/1000);
}

function generateRandomToken(){
    var text = "";
    var possible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 36; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text+Math.round(+new Date()/1000);
}

module.exports={ generateAccountId:generateAccountId, generateRandomToken:generateRandomToken }