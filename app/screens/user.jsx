import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { f, auth, db, storage } from "../../config/config";
import PhotoList from '../component/photolist';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false, user: null, 
    };
    this.loadUser();
  }

  loadUser = () => {
    const params = this.props.route.params;
    if ( params && params.userID ) {
      db.collection('users').doc(params.userID).get().then( usr => {
        if (usr.exists) {
          this.setState({ user: usr.data(), loaded: true, userID: params.userID })
        } else {
          console.log('User not found!')
        }
      })
    }
    
  }

  render() {
    const user = this.state.user;
    return (
      <View style={styles.container}>
        {this.state.loaded ? (
          <View style={styles.profileContainer}>
            <View style={styles.titleContainer}>
              <TouchableOpacity 
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={{ width: 60 }}>Go Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Profile</Text>
              <TouchableOpacity>
                <Text style={{ width: 60, textAlign: "center" }}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileDetails}>
              <Image
                source={{ uri: user.avatar }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginLeft: 10,
                }}
              />
              <View style={styles.usernameDetails}>
                <Text>{user.name}</Text>
                <Text>{user.username}</Text>
              </View>
            </View>

            <PhotoList navigation={this.props.navigation} userID={this.state.userID}/>
          </View>
        ) : (
          <View style={styles.loadingPrompt}>
            <Text>Loading...</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gallary: {
    flex: 1,
    backgroundColor: "navy",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameDetails: {
    marginRight: 10,
    alignItems: "center",
  },
  profileDetails: {
    paddingVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  profileContainer: {
    flex: 1,
  },
  loadingPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    paddingTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    backgroundColor: "white",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
  },
});
