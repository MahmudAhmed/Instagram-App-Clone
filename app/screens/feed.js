import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Feed extends React.Component {
  
  render() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Feed</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    textAlign: 'center',
  },
  titleContainer: {
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    backgroundColor: 'white'
  },
});