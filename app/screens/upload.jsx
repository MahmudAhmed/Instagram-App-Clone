import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { f, auth, db, storage } from "../../config/config";


export default class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false });
      }
    });

  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Upload</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {this.state.loggedIn ? (
            <Text>Upload</Text>
          ) : (
              <View>
                <Text>Please login to Upload photos...</Text>
              </View>
            )}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
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
    flex: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
