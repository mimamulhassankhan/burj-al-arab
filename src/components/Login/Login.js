import { PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import * as firebase from "firebase/app";

import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';



const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
    
    const history = useHistory();
    const location = useLocation();

    const {from} = location.state || { from : {pathname : "/"}};


    const handleGoogleSignIn = () => {
            const googleProvider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(googleProvider)
            .then(res => {
                const {displayName, email} = res.user;
                const newSignedInUser = {name : displayName, email};
                setLoggedInUser(newSignedInUser);
                storeAuthToken();
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const storeAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            sessionStorage.setItem('token', idToken);
            history.replace(from);
          }).catch(function(error) {
            // Handle error
          });
    }
    return (
        <div>
            <h1>This is Login</h1>
            <PrimaryButton text="Google Sign In" onClick={handleGoogleSignIn} allowDisabledFocus />

        </div>
    );
};

export default Login;