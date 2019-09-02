import React, { Component } from 'react';
import {
  Container, Content, ListItem, Separator,
  Button, Text, Icon, Left, Right, Body,
} from 'native-base';
import { 
  StyleSheet,  
} from 'react-native';

export default class TermScreen extends Component {
  constructor(props) {
    super(props);    
  }

  render() {
    return (
      <Container>        
        <Content>         
        </Content>
      </Container>
    );
  }
}

TermScreen.navigationOptions = {
  title: 'Setting',
};

const styles = StyleSheet.create({
  ImageBoxImg: {
    backgroundColor: 'gray',
    marginRight: 15,
  },
  formBoxButton: {
    margin: 30
  },
});
