import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import TextTicker from "react-native-text-ticker";
import { NavigationActions } from "react-navigation";
import { RNCamera } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import { firebase } from "@react-native-firebase/messaging";
import Request from "../_services/Request";
import Toast from "react-native-simple-toast";

class BarcodeScanner extends Component {
  state = {
    scanningEnabled: true,
  };

  checkBarcode(barcode) {
    console.log(barcode);
    Request.getRequest(`barcodes/${barcode}`)
      .then(async (response) => {
        console.log("response barcode is", response);
        if (
          response == undefined ||
          response == null ||
          response == "" ||
          response[0] == undefined
        ) {
          console.log("Its adding");
          this.addBarcode(barcode);
        } else {
          Alert.alert(
            "Duplicate Barcode found!",
            "This barcode has already been scanned",
            [{ text: "OK", onPress: () => console.log("alert closed") }]
          );
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error, undefined, 4));
      });
  }

  addBarcode(barcode) {
    console.log(barcode);
    Request.postRequest(`barcodes/${barcode}`)
      .then(async (response) => {
        console.log("Response is", response);
        if (response.status === 1) {
          console.log(response);
        } else {
          console.log("something while adding barcode in database");
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error, undefined, 4));
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.props.navigation.navigate("ActiveStudies", {})}
          >
            <Image
              style={styles.backButton}
              source={require("../images/back.png")}
            />
          </TouchableOpacity>
          <View style={{ flex: 5, marginRight: 5 }}>
            <TextTicker style={{ color: "white", fontSize: 20 }}>
              {"Barcode Scanner"}
            </TextTicker>
          </View>
        </View>

        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
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
          onBarCodeRead={(barcode) => {
            if (this.state.scanningEnabled) {
              Alert.alert(
                `${barcode.data}`,
                "Please verify if the displayed value matches the barcode",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Canceled"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: async () => {
                      console.log("Barcode DAta is ", barcode.data);
                      await this.checkBarcode(barcode.data);
                      await this.props.navigation.goBack();
                      await this.props.navigation.state.params.onBarcodeRecognized(
                        barcode.data
                      );
                    },
                  },
                ]
              );
              this.setState({ scanningEnabled: false });
            }
          }}
        >
          <BarcodeMask />
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
  navigationHeader: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "#1f427a",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },
});

export default BarcodeScanner;
