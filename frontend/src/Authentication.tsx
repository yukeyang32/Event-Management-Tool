import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
    User,
    GoogleAuthProvider,
    onAuthStateChanged,
    getAuth,
    signOut,
  } from 'firebase/auth';
  import FirebaseAuth from 'react-firebaseui/FirebaseAuth';

const firebaseConfig = {
    apiKey: "AIzaSyCBxSO2S2KsxXlJMQe5f_EqMK23zxh6Ndo",
    authDomain: "trends-web-dev-assignment.firebaseapp.com",
    projectId: "trends-web-dev-assignment",
    storageBucket: "trends-web-dev-assignment.appspot.com",
    messagingSenderId: "505439368690",
    appId: "1:505439368690:web:2dc47f4a5d32eb9237676b",
    measurementId: "G-XQ1DFRGPQ1"
  };
  const firebase = initializeApp(firebaseConfig);

  const auth = getAuth(firebase);
  
  type Props = {
    readonly children: React.ReactNode;
    readonly handleUserID: (user_id:User|null) => void;
  };
  
  const Authentication = ({ children, handleUserID }: Props) => {
    const [user, setUser] = useState<User | null>(null);
  
    const uiConfig = {
      signInFlow: 'popup',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    };
  
    useEffect(() => {
      onAuthStateChanged(auth, setUser)
      handleUserID(user);
    }, [user]);

    //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
  
    return (
      <>
        {user ? (
          <>
            <h2>Hi, {user.displayName}!</h2>
            <button onClick={() => signOut(auth)}>Sign Out</button>
            {children}
          </>
        ) : (
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        )}
      </>
    );
  };

  export default Authentication;