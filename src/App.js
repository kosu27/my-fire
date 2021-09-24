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
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");

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

  const handleClickAddButton = async () => {
    if (!userName || !age) {
      alert('"userName" or "age" が空です');
      return;
    }
    const parsedAge = parseInt(age, 10);

    if (isNaN(parsedAge)) {
      alert('"number" は半角の数値で入力してください');
      return;
    }

    const db = firebase.firestore();
    //setでの追加方法

    // await db.collection("users").doc("1").set(
    //   {
    //     // name: "Dummy",
    //     age: 1,
    //   },
    //   { merge: true }
    // );
    await db.collection("users").add({
      name: userName,
      age: parsedAge,
    });

    setUserName("");
    setAge("");
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
      <div>
        <label htmlFor="username">userName : </label>
        <input
          type="text"
          id="username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <label htmlFor="age">age : </label>
        <input
          type="text"
          id="age"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
      </div>
      <button onClick={handleClickFetchButton}>取得</button>
      <button onClick={handleClickAddButton}>追加</button>
      <ul>{userListItems}</ul>
    </div>
  );
}

export default App;
