import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { auth, db } from "../../config/config";
import { TextInput } from "react-native-gesture-handler";

export default class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      authStep: 0,
      email: '',
      pass: '',
      moveScreen: false
    };
  }

  componentDidMount() {
    if (this.props.moveScreen) {
      this.setState({ moveScreen: true})
    }
  }

  showLogin = () => {
    if (this.state.moveScreen) {
      this.props.navigation.navigate('Upload')
    }
    this.setState({ authStep: 1})
  }

  showSignUp = () => {
    if (this.state.moveScreen) {
      this.props.navigation.navigate('Upload')
    }
    this.setState({ authStep: 2 })
  }

  loginUsr = async() => {
    const email = this.state.email, password = this.state.password;
    
    if (email && password) {
      await auth
      .signInWithEmailAndPassword(email,password)
      .catch(err => { 
        console.log('error logging in', err); 
        alert(err)
      })
    } else {
      alert('Email/Password cannot be empty!')
    }
  }

  signupUsr = async () => {
    const email = this.state.email, 
      password = this.state.password, 
        name = this.state.name, 
          username = this.state.username;

    if (email && password && name && username) {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then( usrObj => {
            db.collection('users').doc(usrObj.user.uid).set({
              email: email,
              name: name,
              username: `${username}`,
              avatar: 'http://gravatar.com/avatar'
            }, (err => console.log('error pushing to db', err)))
        })
        .catch(err => {
          console.log('error logging in', err);
          alert(err)
        })
    } else {
      alert('Email/Password cannot be empty!')
    }
  }

  
  render() {
    return (
      <View style={styles.container}>
        <Text>You are not logged in</Text>
        <Text>{this.props.message}</Text>
        { this.state.authStep == 0 ? (
          <View style={styles.btnsCNT}>
            <TouchableOpacity onPress={ () => this.showLogin() }>
              <Text style={styles.loginBtn}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.orTxt}>or</Text>
            <TouchableOpacity onPress={() => this.showSignUp() }>
              <Text style={styles.signupBtn}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginVertical: 20}}>
            { this.state.authStep == 1 ? (
              <View>
                  <TouchableOpacity 
                    style={styles.cancelCNT}
                    onPress={() => this.setState({ authStep: 0 })}
                    >
                    <Text style={styles.cancelBtn}>⬅️ Cancel</Text>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.formTitle}>Login</Text>
                    <Text>Email Address:</Text>
                    <TextInput 
                      keyboardType={'email-address'}
                      onChangeText={ text => this.setState({email: text})}
                      value={this.state.email}
                      placeholder={'enter your email address...'}
                      style={styles.formInput}
                    />
                    <Text>Password:</Text>
                    <TextInput
                      secureTextEntry={true}
                      onChangeText={text => this.setState({ password: text })}
                      value={this.state.password}
                      placeholder={'enter your password...'}
                      style={styles.formInput}
                    />
                    <TouchableOpacity
                      style={styles.submitCNT}
                      onPress={() => this.loginUsr()}
                    >
                      <Text style={styles.submitBtn}>Login</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            ) : (
              <View>
                    <TouchableOpacity
                      style={styles.cancelCNT}
                      onPress={() => this.setState({ authStep: 0 })}
                    >
                      <Text style={styles.cancelBtn}>⬅️ Cancel</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.formTitle}>Sign Up</Text>
                      <Text>Name:</Text>
                      <TextInput
                        onChangeText={text => this.setState({ name: text })}
                        value={this.state.name}
                        placeholder={'enter your name...'}
                        style={styles.formInput}
                      />
                      <Text>Username:</Text>
                      <TextInput
                        onChangeText={text => this.setState({ username: text })}
                        value={this.state.username}
                        placeholder={'enter your username...'}
                        style={styles.formInput}
                      />
                      <Text>Email Address:</Text>
                      <TextInput
                        keyboardType={'email-address'}
                        onChangeText={text => this.setState({ email: text })}
                        value={this.state.email}
                        placeholder={'enter your email address...'}
                        style={styles.formInput}
                      />
                      <Text>Password:</Text>
                      <TextInput
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ password: text })}
                        value={this.state.password}
                        placeholder={'enter your password...'}
                        style={styles.formInput}
                      />
                      <TouchableOpacity
                        style={[styles.submitCNT, {backgroundColor: 'blue'}]}
                        onPress={() => this.signupUsr()}
                      >
                        <Text style={styles.submitBtn}>Sign Up</Text>
                      </TouchableOpacity>
                    </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitCNT: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  submitBtn: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formInput: {
    width: 250,
    marginVertical: 10,
    padding: 5,
    borderColor: 'grey',
    borderRadius: 3,
    borderWidth: 1
  },
  cancelBtn: {
    fontWeight: 'bold',
  },
  cancelCNT: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 5, 
    marginBottom: 10
  },
  orTxt: {
    marginHorizontal: 10
  },
  loginBtn: {
    fontWeight: 'bold',
    color: 'green'
  },
  signupBtn: {
    fontWeight: 'bold',
    color: 'blue'
  },
  btnsCNT: {
    flexDirection: 'row',
    marginVertical: 20
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});