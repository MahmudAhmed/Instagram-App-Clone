import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { f, auth, db, storage } from "../../config/config";

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Comments</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.state.loaded ? (
            <Text>{this.props.route.params.photoID}</Text>
          ) : (
            <View>
              <Text>Please login to comments on photos...</Text>
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
