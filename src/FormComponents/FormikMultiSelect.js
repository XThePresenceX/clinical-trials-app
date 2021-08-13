import React from "react";
import { View } from "react-native";
import { MultipleSelectPicker } from "react-native-multi-select-picker";
import {
  withFormikControl,
  withNextInputAutoFocusInput
} from "react-native-formik";
import { compose } from "recompose";
class MultiSelectQuestion extends React.PureComponent {
  render() {
    const { value, setFieldValue, options } = this.props;
    return (
      <View>
        <MultipleSelectPicker
          items={options.map(option => {
            return { label: option.optionName, value: option.optionName };
          })}
          onSelectionsChange={ele => {
            setFieldValue(ele);
          }}
          selectedItems={value}
          buttonStyle={{
            backgroundColor: "white",
            height: 100,
            justifyContent: "center",
            alignItems: "center"
          }}
          buttonText="hello"
          checkboxStyle={{ height: 20, width: 20 }}
        />
      </View>
    );
  }
}

export default compose(
  withFormikControl,
  withNextInputAutoFocusInput
)(MultiSelectQuestion);
