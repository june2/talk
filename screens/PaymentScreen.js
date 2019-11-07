import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Right,
  Body,
  Icon,
  Spinner
} from 'native-base';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import React, { Component } from 'react';
import Colors from './../constants/Colors';
import authStore from './../stores/AuthStore';

const itemSkus = Platform.select({
  ios: [
    'p700',
    'p4000',
    'p16000',
    'p40000',
    'p80000',
  ],
  android: [
    'p700',
    'p4000',
    'p16000',
    'p40000',
    'p80000',
  ],
});

export default class PaymentScreen extends Component {
  purchaseUpdateSubscription = null
  purchaseErrorSubscription = null

  static navigationOptions = ({ navigation }) => {
    return {
      title: '포인트 구매',
      navigatorStyle: {
        navBarHidden: false,
      },
      headerLeft: (
        <Icon name='md-arrow-round-back'
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, .9)',
            marginHorizontal: 16,
            textAlign: 'center',
          }}
          onPress={() => navigation.goBack()}
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoading: false
    }
  }

  _sucess() {
    Alert.alert("상품 구매", "정상처리 되었습니다.!", [
      {
        text: 'OK', onPress: () => {
          this.setState({ isLoading: false });
          this.props.navigation.goBack();
        }
      },
    ]);
  }

  _empty() {
    Alert.alert("상품 준비 중", "죄송합니다. 지금 이용가능한 상품이 없습니다!", [
      {
        text: 'OK', onPress: () => {
          this.setState({ isLoading: false });
          this.props.navigation.goBack();
        }
      },
    ]);
  }

  _error(msg = "죄송합니다. 지금 이용가능한 상품이 없습니다!") {
    Alert.alert("상품 구매 오류", msg, [
      {
        text: 'OK', onPress: () => {
          this.setState({ isLoading: false });
          this.props.navigation.goBack();
        }
      },
    ]);
  }

  async _purchase(sku) {
    try {
      this.setState({ isLoading: true });
      await RNIap.requestPurchase(sku, false);
      // Alert.alert("구매!!" + res);
    } catch (err) {
      this._error()
    }
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const products = await RNIap.getProducts(itemSkus);
      if (products.length === 0) {
        this._empty();
      }
      if (products) {
        products.sort((a, b) =>
          (Number(a.price) > Number(b.price)) ? 1 :
            ((Number(b.price) > Number(a.price)) ? -1 : 0)
        );
        this.setState({ products, isLoading: false });
      }
    } catch (err) {
      this._error();
    }

    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const res = await authStore.purchaseItem(Platform.OS, purchase);
      if (res && res.suceess) {
        try {
          if (Platform.OS === 'ios') {
            RNIap.finishTransactionIOS(purchase.transactionId);
          } else {
            RNIap.consumePurchaseAndroid(purchase.purchaseToken);
          }
          RNIap.finishTransaction(purchase);
          // update point
          authStore.me.point = res.point;
          return this._sucess();
        } catch (error) {
          this._error(JSON.stringify(error))
        }
      } else {
        this._error()
      }
    });

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        this._error("구매 취소하셨습니다.")
      },
    );
  }

  componentWillUnmount() {
    this.setState({ isLoading: false });
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }


  render() {
    return (
      <Container>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoading}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Spinner color={Colors.spinner} />
          </View>
        </Modal>
        <Content style={styles.content}>
          {this.state.products.map((item, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => this._purchase(item.productId)}>
                <Card key={i} style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    <Left>
                      <Body>
                        <Text style={styles.text}>{item.title}</Text>
                        {/* <Text note>{item.description}</Text> */}
                      </Body>
                    </Left>
                    <Right>
                      <Text style={styles.text}>{item.localizedPrice}</Text>
                    </Right>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            )
          })}
        </Content>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
  card: {
    flex: 0,
    backgroundColor: Colors.tintColor,
    // padding: 15
  },
  cardItem: {
    flex: 0,
    margin: 20,
    backgroundColor: Colors.tintColor,
    // padding: 30,
  },
  text: {
    color: Colors.noticeText
  },
});