import * as React from "react";
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { f, auth, db, storage } from "../../config/config"; 
import { timeSince } from "../utils/time_ago";
import PhotoList from '../component/photolist';

export default class Feed extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Feed</Text>
        </View>
        <PhotoList navigation={this.props.navigation}/>
        
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