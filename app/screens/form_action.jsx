import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from "react-native";

export default class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', pass: ''}
  } 

  render() { 
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text>Email:</Text>
          <TextInput
            onChangeText={(text) => this.setState({ email: text })}
            backgroundColor="lightgray"
            value={this.state.email}
          />
          <Text>Password:</Text>
          <TextInput 
            onChangeText={(text) => this.setState({ pass: text })}
            backgroundColor="lightgray"
            secureTextEntry={true}
            value={this.state.pass}
          />
        </View>
        <TouchableHighlight
          style={styles.btnContainer}
          onPress={() =>
            this.props.formAction(this.state.email, this.state.pass)
          }
        >
          <Text
            style={styles.actionBtn}
          >
            {this.props.formType === "signup" ? 'Register' : 'Login'}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    padding: 10,
  },
  actionBtn:{
    fontWeight: "bold",
  },
  btnContainer:{
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  container: {
    backgroundColor: "skyblue",
    width: '60%',
    marginVertical: 5
  },
});
