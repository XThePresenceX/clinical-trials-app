import React, { Component } from "react";
import { View, TouchableHighlight, Text, StyleSheet } from "react-native";
import SignatureCapture from "react-native-signature-capture";
import Request from "../_services/Request";
import Toast from "react-native-simple-toast";
class SignatureScreen extends Component {
  _onSaveEvent(result) {
    const requestBody = {
      base64String: result.encoded
    };
    Request.postRequest(`signature`, requestBody)
      .then(async response => {
        Toast.show("Signature recorded");
        await this.props.navigation.state.params.onSignatureReceived(
          response.signatureFileId
        );
        await this.props.navigation.goBack();
      })
      .catch(error => {
        Toast.show("There was an error recording recording your signature.");
      });
  }
  saveSign() {
    this.refs["sign"].saveImage();
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.topText}>Enter your signature</Text>
        <SignatureCapture
          style={[{ flex: 5 }, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent.bind(this)}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={"portrait"}
        />
        <View
          style={{ flex: 1, flexDirection: "row", backgroundColor: "#fff" }}
        >
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.saveSign();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.resetSign();
            }}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topText: {
    fontSize: 30
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#1f427a",
    margin: 10
  },
  buttonText: {
    color: "#fff"
  }
});

export default SignatureScreen;
