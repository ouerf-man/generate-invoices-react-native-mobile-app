
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import { createStackNavigator } from "@react-navigation/stack"
import GeneratePdf from './screens/GeneratePdf';
import AddElement from "./screens/AddElement"
const Stack = createStackNavigator()
export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="home" screenOptions={{headerStyle:{backgroundColor:"#219ac6"}}}>
          <Stack.Screen name="home" component={Home} options={{headerShown:false}} />
          <Stack.Screen name="devis" component={GeneratePdf}/>
          <Stack.Screen name="ajout" component={AddElement}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
