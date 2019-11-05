import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Right,
  Body
} from 'native-base';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import React, { Component } from 'react';

const itemSkus = Platform.select({
  ios: [
    'com.indeefun.p500',
  ],
  android: [
    // 'android.test.purchased',
    // 'android.test.canceled',
    // 'android.test.refunded',
    // 'android.test.item_unavailable',
    'p500',
  ],
});

export default class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        { title: '700  구매하기', description: '700  구매하기', price: 700 },
        { title: '700  구매하기', description: '700  구매하기', price: 700 },
        { title: '700  구매하기', description: '700  구매하기', price: 700 },
        { title: '700  구매하기', description: '700  구매하기', price: 700 },
        { title: '700  구매하기', description: '700  구매하기', price: 700 }
      ],
    }
  }

  async _purchase(sku) {
    try {
      let res = await RNIap.requestPurchase(sku);
      Alert.alert("구매!!" + res);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  async componentDidMount() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      if (products) {
        this.setState({ products });
      }
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  render() {
    return (
      <Container>
        <Content style={styles.content}>
          {this.state.products.map((el, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => this._purchase(el.productId)}>
                <Card key={i} style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    <Left>
                      <Body>
                        <Text>{el.title}</Text>
                        <Text note>{el.description}</Text>
                      </Body>
                    </Left>
                    <Right>
                      <Text>{el.price}</Text>
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

PaymentScreen.navigationOptions = {
  // title: 'Setting',
};

const styles = StyleSheet.create({
  card: {
    flex: 0,
    // padding: 15
  },
  cardItem: {
    flex: 0,
    // padding: 30,
    margin: 20
  },
  content: {
    padding: 10
  }
});