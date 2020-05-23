import * as React from "react";
import { TextInput, ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { f, auth, db, storage } from "../../config/config";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      imageID: this.uniqueId(),
      imgSelected: false,
      uploading: false,
      caption: '',
      progress: 0
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false });
      }
    });

  }

  componentDidMount(){
    this.askPermissions();
  }

  askPermissions = async () => {
    let res = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: res.status })
    res = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    this.setState({ cameraRoll: res.status })
  }

  findNewImage = async () => {
    const results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!results.cancelled) {
      this.setState({
        imgSelected: true,
        imageID: this.uniqueId(),
        uri: results.uri,
      })
    } else {
      this.setState({
        imgSelected: false,
      });
    }
  }

  uniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  handleUploadClk = () => {
    if ( !this.state.uploading ) { 
      if (this.state.caption !== '') {
        this.setState({uploading: true})
        this.uploadImage();
      } else {
        alert("Please add a caption!")
      }
    }
  } 

  uploadImage = async () => {
    const userID = auth.currentUser.uid;
    const imageID = this.state.imageID;
    const uri = this.state.uri;
    const extension = uri.split('.').pop();
    const response = await fetch(uri);
    const blob = await response.blob();

    const storedFile = storage.ref(`user/${userID}/images`).child(`${imageID}.${extension}`).put(blob)

    storedFile.on("state_changed", (snapshot) => {
      const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      this.setState({progress});
    }, (err) => console.log(err), () => {
      storedFile.snapshot.ref.getDownloadURL().then( (url) => {
        this.addToDatabase(url)
      })
    })

  }

  addToDatabase = (url) => {
    const caption = this.state.caption;
    const authorID = auth.currentUser.uid;
    const posted = new Date(Date.now());

    const obj = {
      url: url,
      authorID,
      caption : caption,
      posted 
    }
    db.collection('photos').add(obj).then( () => {
      this.setState({
        uploading: false,
        imgSelected: false,
        uri: "",
        caption: "",
      });
    })
    .catch( err => {
      console.log(err);
    })

 
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loggedIn ? (
          <View style={this.state.imgSelected ? styles.photoDetails : ""}>
            {this.state.imgSelected ? (
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Upload</Text>
                </View>
                <View style={styles.captionCtn}>
                  <Text>Caption:</Text>
                  <TextInput
                    placeholder="Enter your caption..."
                    onChangeText={(text) => this.setState({ caption: text })}
                    maxLength={150}
                    numberOfLines={4}
                    multiline={true}
                    style={styles.captionInput}
                  />
                  <TouchableOpacity
                    onPress={() => this.handleUploadClk()}
                    style={styles.submitBtnCtn}
                  >
                    <Text style={styles.submitBtn}>Upload & Submit</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  { this.state.uploading ? (
                    <View>
                      <Text>{this.state.progress}%</Text>
                      <ActivityIndicator animating={this.state.uploading}/>
                    </View>
                  ) : <View></View> }
                  <Image 
                    source={{uri: this.state.uri }}
                    style={styles.img}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.uploadTxt}>Upload</Text>
                <TouchableOpacity
                  style={styles.selectPhotoCnt}
                  onPress={() => this.findNewImage()}
                >
                  <Text style={styles.selectPhotoBtn}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text>Please login to Upload photos...</Text>
          </View>
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  img: {
    resizeMode: "cover",
    width: "100%",
    height: 275,
  },
  submitBtn: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: "white",
  },
  submitBtnCtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  captionCtn: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  captionInput: {
    marginVertical: 10,
    lineHeight: 100,
    padding: 5,
    borderWidth: 1,
    color: "black",
    borderColor: "grey",
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  photoDetails: {
    width: "100%",
    flex: 1,
  },
  selectPhotoBtn: {
    textAlign: "center",
    color: "white",
  },
  selectPhotoCnt: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  uploadTxt: {
    fontSize: 28,
    paddingBottom: 15,
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
});
