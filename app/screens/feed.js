import * as React from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { f, auth, db, storage } from "../../config/config"; 
import { timeSince } from "../utils/time_ago";
export default class Feed extends React.Component {

  constructor(props){
    super(props);
    this.state = { list: [], refreshing: false, loading: true }
  }

  componentDidMount(){
    this.fetchPhotos()
  }

  fetchPhotos = () => {

    this.setState({
      refreshing: true,
      list: []
    })
    db.collection("photos")
      .orderBy('posted', 'desc')
      .get()
      .then((querySnapshot) => {
        const list = this.state.list;
        querySnapshot.forEach( doc => {
          db.collection("users")
            .doc(doc.data().author)
            .get()
            .then((userDoc) => {
              if (userDoc.exists) {
                list.push({
                  url: doc.data().url,
                  caption: doc.data().caption,
                  posted: doc.data().posted.seconds,
                  username: userDoc.data().username,
                });
              } else {
                console.log("user not found!");
              }
            })
            .then(() => this.setState({ list }));
        });
        
        this.setState({
          refreshing: false,
          loading: false
        })
        
      })
      .catch((err) => console.log(err));
  }

  handleRefresh = () => {
    this.fetchPhotos()
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Feed</Text>
        </View>

        {this.state.loading ? (
          <View style={styles.loading} >
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
                  <Text>{item.username}</Text>
                </View>
                <Image
                  style={styles.img}
                  source={{
                    uri: item.url,
                  }}
                />
                <View style={styles.btmTextContainer}>
                  <Text>{item.caption}</Text>
                  <Text style={styles.comments}>Comments go here...</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
});