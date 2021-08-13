import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import {
  withFormikControl,
  withNextInputAutoFocusInput
} from "react-native-formik";
import { compose } from "recompose";

class SignatureQuestion extends Component {
  constructor(props) {
    super(props);
    this.focusRef = React.createRef();
  }
  focus() {
    this.focusRef.current.focus();
  }
  state = {
    signatureCaptureOn: false,
    signatureReceived: false
  };
  onSignatureReceived(result) {
    this.props.setFieldValue(result);
    this.setState({ signatureCaptureOn: false, signatureReceived: true });
  }
  render() {
    const { value, setFieldValue, navigation } = this.props;
    console.log(
      this.state.signatureCaptureOn.toString() + " " + this.props.value
    );
    return this.state.signatureCaptureOn ? (
      navigation.navigate("SignatureScreen", {
        onSignatureReceived: this.onSignatureReceived.bind(this)
      })
    ) : this.state.signatureReceived ? (
      <Text>Signature Recorded</Text>
    ) : (
      <View
        ref={this.focusRef}
        style={{
          margin: 5,
          backgroundColor: "#1f427a",
          padding: 15,
          borderRadius: 5,
          alignSelf: "flex-start"
        }}
      >
        <TouchableOpacity
          onPress={() => this.setState({ signatureCaptureOn: true })}
        >
          <Text style={{ color: "white" }}>Enter signature</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default compose(
  withNavigation,
  withFormikControl,
  withNextInputAutoFocusInput
)(SignatureQuestion);
