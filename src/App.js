import React, { useEffect, useState } from "react";
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
  const [documentId, setDocumentId] = useState("");

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("users")
      .orderBy("age", "desc")
      .onSnapshot((querySnapshot) => {
        const _users = querySnapshot.docs.map((doc) => {
          return {
            userId: doc.id,
            ...doc.data(),
          };
        });
        setUsers(_users);
      });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleClickUpdateButton = async () => {
    if (!documentId) {
      alert('"documentId" をセットしてください');
      return;
    }

    // const db = firebase.firestore();
    // await db.collection("users").doc("5AvbTaUeQgxsEMlHsjit").update({
    //   name: "田中",
    //   age: 20,
    // });

    const newData = {};
    if (userName) {
      newData["name"] = userName;
    }
    if (age) {
      newData["age"] = parseInt(age, 10);
    }

    try {
      const db = firebase.firestore();
      await db.collection("users").doc(documentId).update(newData);
      setUserName("");
      setAge("");
      setDocumentId("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDeleteButton = async () => {
    if (!documentId) {
      alert('"documentId" をセットしてください');
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection("users").doc(documentId).delete();
      setUserName("");
      setAge("");
      setDocumentId("");
    } catch (error) {
      console.error(error);
    }
  };

  const userListItems = users.map((user) => {
    return (
      <li key={user.userId}>
        <ul>
          <li>ID : {user.userId}</li>
          <li>name : {user.name} </li>
          <li>age : {user.age}</li>
        </ul>
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
        <label htmlFor="documentId">documentId : </label>
        <input
          type="text"
          id="documentId"
          value={documentId}
          onChange={(e) => {
            setDocumentId(e.target.value);
          }}
        />
        ;
      </div>
      <button onClick={handleClickFetchButton}>取得</button>
      <button onClick={handleClickAddButton}>追加</button>
      <button onClick={handleClickUpdateButton}>更新</button>
      <button onClick={handleClickDeleteButton}>削除</button>
      <ul>{userListItems}</ul>
    </div>
  );
}

export default App;
