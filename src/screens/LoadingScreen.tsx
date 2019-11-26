import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Footer } from 'native-base';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../config';

interface Props {
  navigation: any;
}

class LoadingScreen extends React.Component<Props> {
  componentDidMount() {
    console.log('loading componentDidMount');
    this.checkIfLoggedIn();
  }

  phoneExist = async email => {
    let emailObj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    };

    let response = await fetch(config.serverAddress + '/users/email', emailObj);
    console.log('response', response);
    let responseJson = await response.json();
    console.log('responseJson', typeof responseJson.result);
    return responseJson.result;
  };

  checkIfLoggedIn = async () => {
    firebase.auth().onAuthStateChanged(async user => {
      console.log('loading checkif user:', user);
      // Firebase에 유저 로그인 기록 존재 BOOLEAN. 기록 없으면 loginScreen으로.
      let result = user ? await this.phoneExist(user.email) : null; // ** 휴대폰 캐시 지운 상태 혹은 최초 로그인 시, 최초 user = null 인 상태에서 함수 실행되지 말아야 함

      //user가 있으면 이제 전화번호 등록으로 넘어감.
      //user가 있는데, DB에 번호도 있는 경우는 phoneInput skip하고 바로 Dashboard로 간다?
      console.log('result 서버에 이메일있냐 없냐 이말이야: ', result);
      this.props.navigation.navigate(
        !user ? 'LoginScreen' : result ? 'DrawerNav' : 'PhoneInputScreen'
      );
    });
  };
  render() {
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#7F00FF', '#E100FF']}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: 60,
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#fff'
            }}
          >
            Memon
          </Text>
        </View>
        <Footer
          style={{ justifyContent: 'center', backgroundColor: 'transParent' }}
        >
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>
            @ Don Juan 2019
          </Text>
        </Footer>
      </LinearGradient>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
