import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerHeader } from '../components';
import { screenStyles, styles_PaymentList } from '../screenStyles';
import {
  Container,
  Content,
  Button,
  Right,
  Icon,
  List,
  ListItem,
  Label,
  Spinner
} from 'native-base';
import config from '../../config';
import firebase from 'firebase';
import { isAbsolute } from 'path';
export interface Props {
  navigation: any;
}
export interface State {
  email: string;
  paymentList: Object[];
  refreshing: boolean;
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default class PaymentList extends React.Component<Props, State> {
  state = {
    email: '',
    paymentList: [],
    refreshing: false
  };
  toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };
  pressEvent = payment => {
    console.log(this, 'click!');
    if (payment.boss) {
      console.log('go boss!');
      this.props.navigation.navigate('결제생성', {
        fromListView: true,
        email: this.state.email,
        pricebookId: payment.pricebookId,
        transCompleted: payment.transCompleted
      });
    } else {
      console.log('go pay');
      this.props.navigation.navigate('참여자개별결제페이지', {
        boss: false,
        email: this.state.email,
        pricebookId: payment.pricebookId,
        isPayed: payment.isPayed
      });
    }
  };

  goBack = () => {
    this.props.navigation.navigate('홈');
    return;
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
    this.getOwnPayments();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }
  async getOwnPayments() {
    const user = await firebase.auth().currentUser;
    console.log('==============user:', user.email);
    let emailObj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email
      })
    };
    let response = await fetch(config.serverAddress + '/payment/all', emailObj);
    // console.log('response', response);
    let responseJson = await response.json();
    // console.log('responseJson', responseJson);

    this.setState({ email: user.email, paymentList: responseJson });
  }
  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getOwnPayments();
    this.setState({ refreshing: false });
  };

  dateFormat = date => {
    return date.substring(5, 7) + ' / ' + date.substring(8);
  };

  render() {
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#b582e8', '#937ee0']}>
        <Container style={screenStyles.container}>
          <DrawerHeader title="거래 목록" toggleDrawer={this.toggleDrawer} />
          {this.state.refreshing ? (
            <Spinner
              color="black"
              style={{ position: 'absolute', right: 43, top: 0 }}
            />
          ) : (
            <Icon
              style={{ position: 'absolute', right: 50, top: 28 }}
              type="FontAwesome"
              name="refresh"
              onPress={this.onRefresh}
            />
          )}

          <Content>
            <List
              style={{
                backgroundColor: 'transparent',
                marginLeft: 0,
                marginRight: 12,
                paddingHorizontal: 10,
                marginTop: 10
              }}
            >
              {this.state.paymentList.map((payment, i) => {
                // console.log(payment);
                const price = payment.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                const ItemStyle = payment.transCompleted
                  ? this.styles.completed
                  : payment.boss
                  ? this.styles.bossItem
                  : payment.isPayed
                  ? this.styles.completed
                  : this.styles.partItem;
                const statusTxt = payment.transCompleted
                  ? payment.boss
                    ? '✔️ 수금완료'
                    : '✔️ 지불완료'
                  : payment.boss
                  ? '♦️ 받을 돈'
                  : payment.isPayed
                  ? '✔️ 지불완료'
                  : '♦️ 줄 돈';
                return (
                  //결제 종류별로 색 구분할거임. 그리고 key나 기타로 바로 개별view들어갈 때 해당 키 날릴거.
                  <ListItem style={ItemStyle} key={i}>
                    <Label
                      style={{
                        ...styles_PaymentList.label,
                        color: '#736e72'
                      }}
                    >
                      <Text style={styles_PaymentList.statusTxt}>
                        {statusTxt}
                      </Text>
                      <Text>
                        {'\n'}
                        {payment.title}
                      </Text>
                    </Label>
                    <Text style={styles_PaymentList.infoTxt}>
                      {payment.transCompleted && payment.boss
                        ? '수금 클리어\n'
                        : `${price} 원\n`}
                      {payment.partyDate}
                    </Text>
                    <Right>
                      <Button
                        rounded
                        style={this.styles.button}
                        onPress={() => {
                          console.log(payment);
                          this.pressEvent(payment);
                        }}
                      >
                        <Icon
                          name="arrow-forward"
                          style={{ color: '#907be0' }}
                        />
                      </Button>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </Content>
        </Container>
      </LinearGradient>
    );
  }
  styles = StyleSheet.create({
    container: {
      marginTop: 24,
      flex: 1,
      backgroundColor: 'transparent',
      // alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      width: 50,
      justifyContent: 'center',
      backgroundColor: '#f6f5fc'
    },
    bossItem: { backgroundColor: '#e2b3ff', marginBottom: 5, borderRadius: 5 },
    partItem: { backgroundColor: '#fbc531', marginBottom: 5, borderRadius: 5 },
    completed: { backgroundColor: '#dbdbdb', marginBottom: 5, borderRadius: 5 },
    scrollView: {
      flex: 1,
      backgroundColor: 'pink'
    }
  });
}
