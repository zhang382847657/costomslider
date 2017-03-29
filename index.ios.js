/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CostumSlider from './CostumSlider/costumSlider'

export default class CostumSliderProject extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CostumSlider style={{marginTop:10}} min={1} max={34} sep={3} title={'请选择宝宝年龄'} unit={'周'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('CostumSliderProject', () => CostumSliderProject);
