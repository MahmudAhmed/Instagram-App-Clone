import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import * as Facebook from "expo-facebook";
import { f, auth, db, storage } from "./config/config"; 
import Login from "./app/screens/form_action"


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { loggedIn: false, formView: false}

    auth.onAuthStateChanged( user => {
      if (user) {
        this.setState({ loggedIn: true, formView: false, formType: null })
      } else {
        this.setState({ loggedIn: false });
      }
    })     
  }


  registerUser = (email, password) => {
    auth 
      .createUserWithEmailAndPassword(email, password)
      .then( cred => {
        db.collection('users').doc(cred.user.uid).set({
          email: cred.user.email
        }, (err => console.log('error pushing to db', err)))
      })
      .then(this.setState({ formView: false }))
      .catch((err) => console.log("error registering user", err));
  }

  loginUser = (email, password) => {
    auth
      .signInWithEmailAndPassword(email,password)
      .then( () => this.setState({formView : false}))
      .catch( err => console.log('error logging in', err))
  }

  async facebookLogIn() {
  try {
    await Facebook.initializeAsync("860260627817165");
    const {
      type,
      token,

    } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    if (type === "success") {
      const credential = f.auth.FacebookAuthProvider.credential(token);
      auth.signInAndRetrieveDataWithCredential(credential)
        .then( () => this.setState({formView: false}))
    } 
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}
  render () {
    return (
      <View style={styles.container}>
        <Text>Welcome To Los Nochoes!</Text>
        {this.state.formView ? (
          <Login
            formAction={
              this.state.formType === "signin"
                ? this.loginUser
                : this.registerUser
            }
            formType={this.state.formType}
          />
        ) : (
          <View></View>
        )}
        {!this.state.loggedIn ? (
          <View>
            <View style={styles.authBtns}>
              <TouchableHighlight
                underlayColor="lightgray"
                onPress={() =>
                  this.setState({ formView: true, formType: "signin" })
                }
              >
                <Text style={styles.signIn}>Sign In</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="lightgray"
                onPress={() =>
                  this.setState({ formView: true, formType: "signup" })
                }
              >
                <Text style={styles.signUp}>Sign Up</Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              underlayColor="lightgray"
              onPress={() => this.facebookLogIn()}
            >
              <Text style={styles.facebookBtn}>Facebook Login</Text>
            </TouchableHighlight>
          </View>
        ) : (
          <TouchableHighlight
            underlayColor="lightgray"
            onPress={() => auth.signOut()}
          >
            <Text style={styles.signOut}>
              Sign Out
            </Text>
          </TouchableHighlight>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signOut:{
    padding: 5,
    backgroundColor: 'crimson',
    fontWeight: "bold",
    color: "white"
  },
  facebookBtn: {
    padding: 5,
    backgroundColor: 'navy',
    color: 'white',
    fontWeight: 'bold'
  },
  signIn: {
    padding: 5,
  },
  signUp: {
    padding: 5,
  },
  authBtns: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
