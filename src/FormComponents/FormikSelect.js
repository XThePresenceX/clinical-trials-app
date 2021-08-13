import React from "react";
import { View, Picker, StyleSheet, TouchableOpacity } from "react-native";
import makeInput, {
  withFormikControl,
  withPickerValues,
  withNextInputAutoFocusInput,
} from "react-native-formik";
import { compose } from "recompose";
class SelectQuestion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.focusRef = React.createRef();
  }
  focus() {
    this.focusRef.current.enabled = true;
  }
  render() {
    const {
      error,
      value,
      setFieldValue,
      firstItem,
      name,
      options,
    } = this.props;

    return (
      <View ref={this.focusRef} style={styles.inputContainer}>
        <Picker
          ref={this.focusRef}
          selectedValue={value}
          onValueChange={(changedValue) => {
            setFieldValue(changedValue);
          }}
        >
          <Picker.Item
            key={"unselectable"}
            label={firstItem}
            value={undefined}
          />

          {options.map((opt) => {
            return (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            );
          })}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    padding: 5,
    borderColor: "gray",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
  },
});
export default compose(
  withFormikControl,
  withNextInputAutoFocusInput
)(SelectQuestion);
