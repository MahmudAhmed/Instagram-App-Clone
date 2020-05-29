import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import { f, auth, db, storage } from "../../config/config"; 
import PhotoList from '../component/photolist'; 

export default class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
      editView: false,
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        this.fetchUsr(user.uid)
      } else {
        this.setState({ loggedIn: false });
      }
    }); 
  }

  fetchUsr = (userID) => {
    db.collection('users').doc(userID).get().then((usr) => {
      this.setState({
        loggedIn: true,
        userID: userID,
        name: usr.data().name,
        username: usr.data().username,
        user: usr.data()
      })
    })
  }

  updateUserInfo = () => {
    db.collection('users').doc(this.state.userID).update({
      username: this.state.username,
      name: this.state.name
    }).then( () => {
      alert("Profile Updated")
      this.setState({editView: false}, () => this.fetchUsr(this.state.userID));
    }).catch( err => console.log(err) )
  }


  render() {
    const user = this.state.user;
    return (
      <View style={styles.container}>
        
        {this.state.loggedIn ? (
          <View style={ styles.profileContainer }>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.profileDetails}>
              <Image 
                source={ {uri: user.avatar} }
                style={{width: 100, height: 100, borderRadius: 50, marginLeft: 10 }}
              />
              <View style={styles.usernameDetails}>
                <Text>{user.name}</Text>
                <Text>{user.username}</Text>
              </View>
            </View>
            { this.state.editView ? (
              <View style={styles.editForm}>
                <View>
                  <View>
                    <Text>Name</Text>
                    <TextInput
                      placeholder={this.state.name}
                      onChangeText={text => this.setState({ name: text })}
                      style={styles.textInput}
                      value={this.state.name}
                    />
                  </View>
                  <View>
                    <Text>Username</Text>
                    <TextInput
                      placeholder={this.state.username}
                      onChangeText={text => this.setState({ username: text })}
                      style={styles.textInput}
                      value={this.state.username}
                    />
                  </View>
                </View>
                <View style={styles.editBtnCNT}>
                  <TouchableOpacity
                    onPress={ () => this.setState({ editView: false})}
                  >
                    <Text style={styles.editBtns} >Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.updateUserInfo()}
                  >
                    <Text style={styles.editBtns} >Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileBtns}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => auth.signOut()}
                >
                  <Text>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.setState({ editView: true})}
                >
                  <Text>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.uploadBtn]}
                  onPress={() => this.props.navigation.navigate("Upload")}
                >
                  <Text style={{ color: 'white' }}>Upload New +</Text>
                </TouchableOpacity>
              </View>
            ) }
            

            <PhotoList navigation={this.props.navigation} userID={this.state.userID}/>
          </View>
          ) : (
          <View style={styles.loginPrompt}>
            <Text>Please login to see your profile...</Text>
          </View>
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  textInput: {
    width: 250,
    marginVertical: 10,
    padding: 5,
    borderColor: "grey",
    borderWidth: 1,
  },
  editBtns: {
    padding: 5,
    marginRight: 5,
    backgroundColor: 'navy',
    color: 'white',

  },
  editBtnCNT: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editForm: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  gallary: {
    flex: 1,
    backgroundColor: "navy",
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadBtn: {
    backgroundColor: 'crimson',
  },
  btn: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 100, 
    borderColor: "grey", 
    padding: 10, 
    marginTop: 10, 
    marginHorizontal: 40 
  },
  profileBtns: {
    paddingBottom: 20,
    borderBottomWidth:1,
  },
  usernameDetails: {
    marginRight: 10,
    alignItems: "center"
  },
  profileDetails: {
    paddingVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",

  },
  profileContainer: { 
    flex: 1
  },
  loginPrompt: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    backgroundColor: "white",
    
  },
  container: {
    flex: 1, 
  },
});
 