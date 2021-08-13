import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";
import { withNavigation } from "react-navigation";
import {
  withFormikControl,
  withNextInputAutoFocusInput
} from "react-native-formik";
import { compose } from "recompose";

class BarCodeQuestion extends Component {
  state = {
    barcodeScannerOn: false,
    barcodeFound: false
  };
  async onBarcodeRecognized(barcode) {
    this.setState({ barcodeScannerOn: false, barcodeFound: true });
    await this.props.setFieldValue(barcode);
  }
  render() {
    const { value, setFieldValue, navigation } = this.props;
    return this.state.barcodeScannerOn ? (
      navigation.navigate("BarcodeScanner", {
        onBarcodeRecognized: this.onBarcodeRecognized.bind(this)
      })
    ) : this.state.barcodeFound ? (
      <Text>Barcode: {value}</Text>
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
        <TouchableOpacity
          onPress={() => this.setState({ barcodeScannerOn: true })}
        >
          <Text style={{ color: "white" }}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default compose(
  withNavigation,
  withFormikControl,
  withNextInputAutoFocusInput
)(BarCodeQuestion);
