import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
import { LineChart } from "react-native-chart-kit";
class Reports extends Component {
  state = {
    id: "",
    studyid: "",
    formid: "",
    forms: [],
    body: [
      {
        part: "Head",
        val: "5",
        img: require("../images/reportScreen/head.png")
      },
      {
        part: "Arm",
        val: "4",
        img: require("../images/reportScreen/arm.png")
      },
      {
        part: "Hand",
        val: "3",
        img: require("../images/reportScreen/hand.png")
      },
      {
        part: "Leg",
        val: "4",
        img: require("../images/reportScreen/leg.png")
      }
    ]
  };
  async componentDidMount() {
    const value = await AsyncStorage.getItem("participantId");
    var Study = this.props.navigation.getParam("Study", "0");
    var Form = this.props.navigation.getParam("Form", " ");
    await this.setState({ id: value, studyid: Study, formid: Form });
    this.getForm();
  }
  async getForm() {
    await this.setState({ forms: [] });
    // console.log(id)
    // const url='https://cognizancevct.com:3000/database/get_form_answers/'+this.state.studyid+'/'+this.state.id+'/'+this.state.formid;//url||||||||||||||||||||||||||||||||||||||||||||||||||
    const url =
      "https://cognizancevct.com:3000/database/get_form_answers/52/33/42"; //url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'Authorization':'Basic ' + 'cognizance-api:w85Emt_y)z9TGN[;',
        Authorization: "Basic Y29nbml6YW5jZS1hcGk6dzg1RW10X3kpejlUR05bOw==",
        apiKey: "202k1w6nc-6d0js-4ema-8a3m6-94b2d5osme1b9"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson);
        await this.setState({ forms: responseJson.results });
        // if(responseJson!=='Wrong Credentials!'){
        // }
        return responseJson;
      })
      .catch(error => {
        // reject(error);
        console.log(error);

        return error;
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: "30%",
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
            backgroundColor: "#1f427a",
            alignItems: "flex-start",
            padding: 10,
            paddingTop: 15,
            justifyContent: "space-between"
          }}
        >
          <ImageBackground
            style={[
              {
                height: "100%",
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between"
              }
            ]}
            imageStyle={{ opacity: 0.5 }}
            source={require("../images/reportbg.png")}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                style={[
                  {
                    marginTop: Platform.OS === "ios" ? 25 : 0,
                    width: 30,
                    height: 30,
                    resizeMode: "contain"
                  }
                ]}
                source={require("../images/sidemenu.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Notifications")}
            >
              <Image
                style={[
                  {
                    marginTop: Platform.OS === "ios" ? 25 : 0,
                    width: 30,
                    height: 30,
                    resizeMode: "contain"
                  }
                ]}
                source={require("../images/bell.png")}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.heading,
            { justifyContent: "center", alignItems: "center" }
          ]}
        >
          <Text style={{ fontSize: 17 }}>PAIN SUMMARY</Text>
        </View>
        <ScrollView>
          <View style={{ padding: 15 }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "white",
                elevation: 5,
                marginBottom: 10,
                borderRadius: 5
              }}
            >
              <Text>Rating</Text>
              <LineChart
                data={{
                  labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dev"
                  ],
                  datasets: [
                    {
                      data: [2, 7, 3, 5, 9]
                    }
                  ]
                }}
                width={Dimensions.get("window").width - 40} // from react-native
                height={220}
                // yAxisLabel={"$"}
                // yAxisSuffix={"k"}
                verticalLabelRotation={-90}
                chartConfig={{
                  backgroundColor: "#1f427a",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(31, 66, 122, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#1f427a"
                  }
                }}
                bezier
                style={{
                  paddingLeft: 0
                }}
              />
              <Text style={{ alignSelf: "flex-end" }}>Month</Text>
            </View>
            <View
              style={{
                padding: 15,
                borderRadius: 5,
                width: Dimensions.get("window").width - 30,
                elevation: 5,
                backgroundColor: "white"
              }}
            >
              <Text style={{ color: "#1f427a" }}>AVG BY BODY PART:</Text>
              <FlatList
                data={this.state.body}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        paddingTop: 10,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        style={[
                          {
                            width: 15,
                            height: 15,
                            marginRight: 10,
                            resizeMode: "contain"
                          }
                        ]}
                        source={item.img}
                      />
                      <Text>{item.part + ": "}</Text>
                      <Text>{item.val}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
        {/* <NavigationEvents
                  onWillFocus={() => this.getForm()}
                /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    position: "absolute",
    height: 40,
    width: "75%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    marginTop:
      Platform.OS === "ios"
        ? (Math.round(Dimensions.get("window").height) / 100) * 30 - 20
        : (Math.round(Dimensions.get("window").height) / 100) * 30 - 25
  },
  formItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d6d6d6",
    paddingVertical: 10
  }
});

export default Reports;
