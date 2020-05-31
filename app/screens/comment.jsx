import * as React from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { f, auth, db, storage } from "../../config/config";
import { timeSince } from "../utils/time_ago";

import Auth from '../component/auth'; 


export default class Comments extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      commentList: [],
      refreshing: false,
      loading: true,
      comment: '',
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.collection('users').doc(user.uid).get().then((usr) => {
          this.setState({ loggedIn: true, userID: user.uid, user: usr.data() })
        })
      } else {
        this.setState({ loggedIn: false });
      }
    });
    this.loadComments();
  }

  loadComments = () => {
    const params = this.props.route.params;
    const commentList = this.state.commentList;
    if (params && params.photoID) {
      db.collection('comments').doc(params.photoID).collection('all')
        .orderBy('posted', 'desc')
        .get()
        .then(snapshotQuery => {
          snapshotQuery.forEach( (doc) => {
            db.collection('users').doc(doc.data().authorID)
              .get()
              .then( usr => {
                if (usr.exists) {
                  commentList.push({
                    id: doc.id,
                    userID: usr.id,
                    username: usr.data().username,
                    comment: doc.data().comment,
                    posted: doc.data().posted.seconds,
                  });
                } else {
                  console.log('usr non-existant');
                };
              })
              .then( () => {
                this.setState({ photoID: params.photoID, refreshing: false, loading: false })
              })
            })
      })
    }
  }

  handleRefresh = () => {
    this.setState({ commentList: [], refreshing: true, loading: true }, () => this.loadComments());
  }

  postComment = () => {
    if (this.state.comment) {
      const commentOBJ = {
        authorID: auth.currentUser.uid,
        posted: new Date(Date.now()),
        comment: this.state.comment
      }

      db.collection('comments').doc(this.state.photoID).collection('all').add(commentOBJ)
        .then(doc => {
          this.setState({ comment: '' }, () => {
            this.handleRefresh();
          })
        })
        .then(() => Keyboard.dismiss())

    } else {
      alert('Please enter a comment!')
    }
    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={{ width: 60 }}>Go Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity>
            <Text style={{ width: 60 }}></Text>
          </TouchableOpacity>
        </View>
        <View
          style={ styles.container }
        >
          { this.state.commentList.length ? (
              <View style={styles.container}>
                <FlatList 
                  data={this.state.commentList}
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                  style={styles.flatList}
                  renderItem={({ item, index }) => (
                    <View style={styles.itemCNT}>
                      <View style={styles.commentHeading}>
                        <Text>{timeSince(item.posted * 1000)} ago</Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("User", {
                              userID: item.userID,
                            })
                          }>
                          <Text>{item.username}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.comment}>
                        <Text>{item.comment}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            ) : (
              <View>
                <Text>Be the first to comment...</Text>
              </View>
            )}
          { this.state.loggedIn ? (
            <KeyboardAvoidingView 
              behavior={Platform.OS == "ios" ? "padding" : "height"}
              style={styles.KAV}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Text style={styles.postTitle}>Post Comment</Text>
                  <TextInput 
                    placeholder={'enter your comment'}
                    onChangeText={ (text) => this.setState({comment: text})}
                    style={styles.txtInput}    
                    value={this.state.comment}             
                  />
                  <TouchableOpacity
                    onPress={ () => this.postComment() }
                  >
                    <Text style={styles.btn}>Post</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            
          ) : (
            <Auth message={'Please login to post a comment'} moveScreen={true} navigation={this.props.navigation}/>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'navy',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  txtInput: {
    marginVertical: 10, 
    height: 50, 
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderRadius: 3,
    borderWidth: 1,
  },
  postTitle: {
    fontWeight: 'bold',
  },
  KAV: {
    borderTopWidth: 1,
    borderTopColor: 'navy',
    padding: 10,
    marginBottom: 15,
  },
  comment:{
    padding: 5,
  },
  commentHeading: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  itemCNT: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 5,
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  flatList: {
    flex: 1,
    backgroundColor: '#eee',
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
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
});
