
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBQoUB9jUoY2_Xz7tYZFhWrqpSrM5Is9ro",
    authDomain: "fir-group-web-chat-app.firebaseapp.com",
    databaseURL: "https://fir-group-web-chat-app.firebaseio.com",
    projectId: "fir-group-web-chat-app",
    storageBucket: "fir-group-web-chat-app.appspot.com",
    messagingSenderId: "859600669891"
  };
  var firebase= firebase.initializeApp(config);
  var db = firebase.firestore();
  var usernameInput = document.querySelector('#username');

  var textInput = document.querySelector('#text');
  var postButton = document.querySelector('#post');

  postButton.addEventListener("click", function() {
    var msgUser = usernameInput.value;
    var msgText = textInput.value;
    console.log("msg");

    db.collection("chats").add({timestamp: new Date().getTime(),userName : msgUser, likes:0, text:msgText,messageId: msgUser+new Date().getTime()})
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    textInput.value = "";
    });

  db.collection("chats").orderBy("timestamp", "asc")
  .onSnapshot(function(snapshot) {
    document.getElementById("messages").innerHTML ="";
    
    snapshot.forEach(element => {  
      var msg = element.data();
      var msgUsernameElement = document.createElement("b");
      msgUsernameElement.textContent = msg.userName;
      var msgTextElement = document.createElement("p");
      msgTextElement.textContent = msg.text; 
      var msgLikeButton = document.createElement("BUTTON");        // Create a <button> element
      var t = document.createTextNode("LIKE");      
      msgLikeButton.appendChild(t);
      var msgLikesElement = document.createElement("p");
      msgLikesElement.textContent = msg.likes;
      var msgElement = document.createElement("div");
      msgElement.appendChild(msgUsernameElement);
      msgElement.appendChild(msgTextElement);
      msgElement.appendChild(msgLikeButton);
      msgElement.appendChild(msgLikesElement);
      msgElement.className = "msg";
      document.getElementById("messages").appendChild(msgElement);
      
      msgLikeButton.addEventListener("click",function(){  
        var docRef = db.collection('chats').doc(element.id);
        return db.runTransaction(function(transaction) {
          return transaction.get(docRef).then(function(sfDoc) {
              if (!sfDoc.exists) {
                  throw "Document does not exist!";
              }
              var newLikes = sfDoc.data().likes + 1;
              transaction.update(docRef, { likes: newLikes });
          });
      })
      .then(function() {
          console.log("Transaction successfully committed!");
      })
      .catch(function(error) {
        console.log("Transaction failed: ", error);
      })        
    })
  });
}, function(error) {
    console.log(snapshot)
});

 
