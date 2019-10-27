import React, { Component } from "react";
import { RecyclerListView, LayoutProvider, DataProvider } from "recyclerlistview";
import { Platform, View, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { observer } from 'mobx-react';
import FlightData from "./UsersScreen2_FlightData";
import HotelCard from "./UsersScreen2_HotelCard";
import FlightCard from "./UsersScreen2_FlightCard";
import userStore from '../stores/UserStore';
import UserItem from '../components/UserItem';
import { DataCall } from './UsersScreen2_DataCall';


let { height, width } = Dimensions.get('window');

@observer
export default class UsersScreen extends Component {
  constructor(args) {
    super(args);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2
      }),
      layoutProvider: new LayoutProvider(
        index => 0,
        (type, dim) => {
          dim.width = width;
          dim.height = 65;
        }
      ),
      data: [],
      totalDocs: 0,
      page: 1,
      limit: 10,
      hasNextPage: true,
      isLoading: false,
    };
  }


  _renderRow = (type, data) => {
    return (
      <UserItem user={data} navigation={this.props.navigation} />
    );
  }

  componentWillMount() {
    this._fetchMoreData();
  }

  _fetchMoreData = async () => {
    if (!this.state.isLoading && this.state.hasNextPage) {
      this.state.isLoading = true;
      const res = await DataCall.get('users', '/', this.state.count, 20);
      this.state.isLoading = false;
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          this.state.data.concat(res.docs)
        ),
        data: this.state.data.concat(res.docs),
        page: res.page + 1,
        totalDocs: res.totalDocs,
        refreshing: false,
        hasNextPage: res.hasNextPage
      });
    }
  }

  _handleListEnd = () => {
    this._fetchMoreData();
    this.setState({});
  };

  _renderFooter = () => {
    return this.inProgressNetworkReq
      ? <ActivityIndicator
        style={{ margin: 10 }}
        size="large"
        color={'black'}
      />
      : <View style={{ height: 60 }} />;
  };

  render() {
    return <View style={styles.container}>
      {this.state.totalDocs > 0
        ? <RecyclerListView
          style={{ flex: 1 }}
          contentContainerStyle={{}}
          initialRenderIndex={0}
          onEndReached={this._handleListEnd}
          dataProvider={this.state.dataProvider}
          layoutProvider={this.state.layoutProvider}
          rowRenderer={this._renderRow}
          renderFooter={this._renderFooter}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={async () => {
                  this.setState({
                    data: [],
                    page: 1,
                  }, this._fetchMoreData);
                }}
              />
            )
          }}
        />
        : null}
    </View>
  }
}
const styles = {
  container: {
    flex: 1,

  },
  header: {
    height: 65,
    backgroundColor: 'orange',
    alignItems: "center",
    flexDirection: "row",
    elevation: 4
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 16,
    paddingBottom: 3
  },
  backIcon: {
    height: 23,
    width: 23,
    marginLeft: 16

  }
}