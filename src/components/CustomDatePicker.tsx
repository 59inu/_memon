import React from 'react';
import { DatePicker } from 'native-base';
import { View } from 'react-native';
import moment from 'moment';

const CustomDatePicker = props => {
  return (
    <View style={{ flex: 2.2 }}>
      <DatePicker
        defaultDate={new Date()}
        minimumDate={new Date(2018, 1, 1)}
        // maximumDate={new Date()}
        locale="ko"
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={true}
        animationType="fade"
        androidMode="default"
        placeHolderText="날짜를 선택해주세요."
        textStyle={{ color: '#3b3b3b', paddingLeft: 15 }}
        placeHolderTextStyle={{
          color: '#c2c2c4',
          backgroundColor: 'transparent',
          paddingLeft: 15
        }}
        onDateChange={props.setDate}
        disabled={props.disabled}
        formatChosenDate={date => {
          return moment(date).format('YYYY-MM-DD');
        }}
      />
    </View>
  );
};
export default CustomDatePicker;
