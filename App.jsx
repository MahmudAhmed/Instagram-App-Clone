import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./config/config"; 

import Feed from "./app/screens/feed";
import Profile from "./app/screens/profile";
import Upload from "./app/screens/upload";
import User from "./app/screens/user";
import Comment from "./app/screens/comment";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          headerMode="none"
          mode="modal"
        >
          <Stack.Screen name="Home" component={TabScreen} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="Comments" component={Comment} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


class TabScreen extends React.Component {
  render() {  
    return (
        <Tab.Navigator 
          tabBarOptions={{
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
            tabStyle: {
              justifyContent: "center",
            },
          }}
        >
          <Tab.Screen name="Feed" component={Feed} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="Upload" component={Upload} />
        </Tab.Navigator>
    );
  }
}