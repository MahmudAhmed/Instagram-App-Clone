import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { f, auth, db, storage } from "../../config/config";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loggedIn ? (
          <View style={styles.profileContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.profileDetails}>
              <Image
                source={{ uri: "https://i.pravatar.cc/330" }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginLeft: 10,
                }}
              />
              <View style={styles.usernameDetails}>
                <Text>Name</Text>
                <Text>@username</Text>
              </View>
            </View>
            <View style={styles.profileBtns}>
              <TouchableOpacity style={styles.btn}>
                <Text>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Text>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.uploadBtn]}
                onPress={() => this.props.navigation.navigate("Upload")}
              >
                <Text style={{ color: "white" }}>Upload New +</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gallary}>
              <Text style={{ color: "white" }}>Loading photos...</Text>
            </View>
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
  gallary: {
    flex: 1,
    backgroundColor: "navy",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "crimson",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "grey",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 40,
  },
  profileBtns: {
    paddingBottom: 20,
    borderBottomWidth: 1,
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
  loginPrompt: {
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
