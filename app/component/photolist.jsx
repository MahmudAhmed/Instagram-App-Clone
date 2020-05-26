import * as React from "react";
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { db } from "../../config/config";
import { timeSince } from "../utils/time_ago";

export default class PhotoList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { list: [], refreshing: false, loading: true };
  }

  componentDidMount() {
    this.fetchPhotos(this.props.userID);
  }

  fetchPhotos = (userID=null) => {
    this.setState({
      refreshing: true,
      list: []
    });

    let docRef = db.collection("photos");
    
    if (userID) {
      docRef = db.collection('users').doc(userID).collection('photos');
    }

    docRef
      .orderBy('posted', 'desc')
      .get()
      .then((querySnapshot) => {
        const list = this.state.list;
        querySnapshot.forEach(doc => {
          db.collection("users")
            .doc(doc.data().authorID)
            .get()
            .then((userDoc) => {
              if (userDoc.exists) {
                list.push({
                  photoID: doc.id,
                  url: doc.data().url,
                  caption: doc.data().caption,
                  posted: doc.data().posted.seconds,
                  username: userDoc.data().username,
                  userID: userDoc.id,
                });
              } else {
                console.log("user not found!");
              }
            })
            .then(() => this.setState({ list }))
        });

        this.setState({
          refreshing: false,
          loading: false
        })

      })
      .catch((err) => console.log(err));
  }

  handleRefresh = () => {
    this.fetchPhotos(this.props.userID)
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View style={styles.loading}>
            <Text>Loading...</Text>
          </View>
        ) : (
            <FlatList
              data={this.state.list}
              style={styles.flatList}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              renderItem={({ item, index }) => (
                <View>
                  <View style={styles.topTextContainer}>
                    <Text>{timeSince(item.posted * 1000)} ago</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("User", {
                          userID: item.userID,
                        })
                      }
                    >
                      <Text>{item.username}</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    style={styles.img}
                    source={{
                      uri: item.url,
                    }}
                  />
                  <View style={styles.btmTextContainer}>
                    <Text>{item.caption}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Comments", {
                          photoID: item.photoID,
                        })
                      }
                    >
                      <Text style={styles.comments}>[ View comments ]</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    width: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  comments: {
    marginTop: 10,
    textAlign: "center",
    color: 'blue',
  },
  topTextContainer: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btmTextContainer: {
    padding: 5,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  img: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: 275,
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
    flex: 0,
  },
  container: {
    flex: 1,
    width: '100%'
    // justifyContent: "center",
    // alignItems: "center",
  },
});