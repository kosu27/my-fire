import React, { useState } from "react";
import * as firebase from "firebase";

import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyCOD2u87OvjV8IFevwwK_cSHSeOX3bXy_s",
  authDomain: "test4-a29fa.firebaseapp.com",
  projectId: "test4-a29fa",
  storageBucket: "test4-a29fa.appspot.com",
  messagingSenderId: "328153873019",
  appId: "1:328153873019:web:ea40974cf303505cdb40de",
  measurementId: "G-J9FE0X1BRR",
};
firebase.initializeApp(firebaseConfig);

function App() {
  const [users, setUsers] = useState([]);

  const handleClickFetchButton = async () => {
    const db = firebase.firestore();
    // collectionの取得
    const snapshot = await db.collection("users").get();
    const _users = [];
    snapshot.forEach((doc) => {
      _users.push({
        userId: doc.id,
        ...doc.data(),
      });
    });

    setUsers(_users);
  };

  const userListItems = users.map((user) => {
    return (
      <li key={user.userId}>
        {user.name} : {user.age} : {user.location}
      </li>
    );
  });

  return (
    <div className="App">
      <h1>Hello World2</h1>
      <button onClick={handleClickFetchButton}>取得</button>
      <ul>{userListItems}</ul>
    </div>
  );
}

export default App;
