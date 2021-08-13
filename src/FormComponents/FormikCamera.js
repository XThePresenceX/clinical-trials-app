import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { RNCamera } from "react-native-camera";
import { withNavigation } from "react-navigation";
import {
  withFormikControl,
  withNextInputAutoFocusInput
} from "react-native-formik";
import { compose } from "recompose";

class PictureQuestion extends Component {
  state = {
    cameraOn: false,
    pictureTaken: false
  };
  async onPictureTaken(result) {
    this.setState({
      cameraOn: false,
      pictureTaken: true
    });
    await this.props.setFieldValue(result);
  }
  render() {
    const { value, setFieldValue, navigation } = this.props;
    return this.state.cameraOn ? (
      navigation.navigate("Camera", {
        onPictureTaken: this.onPictureTaken.bind(this)
      })
    ) : this.state.pictureTaken ? (
      <Text>Picture taken</Text>
    ) : (
      <View
        style={{
          margin: 5,
          backgroundColor: "#1f427a",
          padding: 15,
          borderRadius: 5,
          alignSelf: "flex-start"
        }}
      >
        <TouchableOpacity onPress={() => this.setState({ cameraOn: true })}>
          <Text style={{ color: "white" }}>Take a Picture</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default compose(
  withNavigation,
  withFormikControl,
  withNextInputAutoFocusInput
)(PictureQuestion);
