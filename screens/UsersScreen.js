import React, { Component } from "react";
import { View, Text, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { observer } from 'mobx-react';
import { AdMobBanner } from 'expo-ads-admob'
import Notification from '../components/Notification';
import UserItem from '../components/UserItem';
import userStore from '../stores/UserStore';

let { width } = Dimensions.get("window");

@observer
export default class UsersScreen extends React.Component {
  constructor(args) {
    super(args);
    this._rowRenderer = this._rowRenderer.bind(this);    
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: new LayoutProvider(
        index => 0,
        (type, dim) => {
          dim.width = width;
          dim.height = 69;
        }
      ),
      data: [],
      totalDocs: 0,
      offset: 0,
      limit: 30,
      isLoading: false
    };
  }

  _fetchMoreData = async () => {
    if (!this.state.isLoading && this.state.totalDocs >= this.state.data.length) {
      this.state.isLoading = true;
      const res = await userStore.getUsers(this.state.limit, this.state.offset);
      const data = res.docs
      this.state.isLoading = false;
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          this.state.data.concat(data)
        ),
        data: this.state.data.concat(data),
        offset: res.offset + this.state.limit,
        totalDocs: this.state.totalDocs + res.totalDocs,
      });
    }
  }

  _handleListEnd = () => {
    this._fetchMoreData();
    this.setState({});
  };

  _rowRenderer(type, data) {
    return (
      <UserItem user={data} navigation={this.props.navigation} />
    );
  }

  _renderFooter = () => {
    return this.state.isLoading
      ? <ActivityIndicator
        style={{ margin: 10 }}
        size="large"
        color={'black'}
      />
      : <View style={{ height: 60 }} />;
  };

  componentDidMount() {
    this._fetchMoreData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Notification />
        <View>
          <AdMobBanner
            style={styles.banner}
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            onDidFailToReceiveAdWithError={(err) => console.log(err)}
            onAdMobDispatchAppEvent={(evt) => console.log(evt)}
          />
        </View>
        {this.state.totalDocs > 0
          ?
          <View style={styles.list}>
            <RecyclerListView
              style={{ flex: 1 }}
              contentContainerStyle={{}}
              onEndReached={this._handleListEnd}
              dataProvider={this.state.dataProvider}
              layoutProvider={this.state.layoutProvider}
              rowRenderer={this._rowRenderer}
              renderFooter={this._renderFooter}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={async () => {
                      this.setState({
                        data: [],
                        offset: 0,
                      }, this._fetchMoreData);
                    }}
                  />
                )
              }}
            />
          </View>
          : null}
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1
  },
  list: {
    paddingBottom: 60,
    top: 60,
    flex: 1
  },
  banner: {
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
};