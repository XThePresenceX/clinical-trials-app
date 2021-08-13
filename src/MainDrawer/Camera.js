import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { RNCamera } from "react-native-camera";
import Request from "../_services/Request";
import Toast from "react-native-simple-toast";
class Camera extends Component {
  state = {
    imageUri: "",
    imageBase64String: "",
    showPreview: false,
    cameraEnabled: true,
  };
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const image = await this.camera.takePictureAsync(options);
      console.log(JSON.stringify(image.uri, undefined, 4));
      this.setState({
        cameraEnabled: false,
        imageUri: image.uri,
        imageBase64String: image.base64,
        showPreview: true,
      });
    }
  };
  uploadPictureToS3 = async () => {
    const { imageBase64String } = this.state;
    const requestBody = {
      base64String: imageBase64String,
    };
    Request.postRequest(`picture`, requestBody)
      .then(async (response) => {
        await this.props.navigation.state.params.onPictureTaken(
          response.imageFileId
        );
        await this.props.navigation.goBack();
        Toast.show("Image uploaded.");
      })
      .catch((error) => {
        Toast.show("There was an error uploading your image.");
      });
  };
  resetCamera = () => {
    this.setState({
      imageUri: "",
      imageBase64String: "",
      showPreview: false,
      cameraEnabled: true,
    });
  };
  _onSaveEvent(result) {
    const requestBody = {
      base64String: result.encoded,
    };
    Request.postRequest(`signature`, requestBody)
      .then(async (response) => {
        Toast.show("Signature recorded");
        await this.props.navigation.state.params.onSignatureReceived(
          response.signatureFileId
        );
        await this.props.navigation.goBack();
      })
      .catch((error) => {
        Toast.show("There was an error recording recording your signature.");
      });
  }
  render() {
    const { imageUri, showPreview } = this.state;
    if (showPreview) {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={{ uri: imageUri }}
            style={styles.imagePreview}
          >
            <View style={styles.confirmContainer}>
              <Text style={styles.confirmQuestionContainer}>Confirm image</Text>
              <View style={styles.confirmButtonsContainer}>
                <Button
                  onPress={this.uploadPictureToS3.bind(this)}
                  title="Yes"
                  buttonStyle={styles.confirmButton}
                  titleStyle={styles.confirmButtonText}
                  style={styles.confirmButton}
                />
                <Button
                  onPress={this.resetCamera.bind(this)}
                  title="No"
                  buttonStyle={styles.confirmButton}
                  titleStyle={styles.confirmButtonText}
                  style={styles.confirmButton}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
        >
          <View style={styles.captureOverlay}>
            <Button
              onPress={this.takePicture.bind(this)}
              title="Snap"
              buttonStyle={styles.confirmButton}
              titleStyle={styles.confirmButtonText}
              style={styles.confirmButton}
            />
          </View>
        </RNCamera>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  imagePreview: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
  },
  confirmContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  confirmQuestionContainer: {
    flex: 1,
  },
  confirmButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#1f427a",
    color: "#fff",
    height: 40,
    marginHorizontal: 5,
  },
  confirmButtonText: {
    fontSize: 20,
    color: "#fff",
  },
});

export default Camera;
