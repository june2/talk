import React, { Component } from "react";
import { AppState, Platform, View, Dimensions, ActivityIndicator, RefreshControl, Image, StatusBar } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { observer } from 'mobx-react';
import Admob from '../components/Admob';
import Notification from '../components/Notification';
import UserItem from '../components/UserItem';
import FilterButton from '../components/FilterButton';
import FilterBox from '../components/FilterBox';
import userService from '../services/users';
import filterStore from './../stores/FilterStore';


let { width } = Dimensions.get("window");

@observer
export default class UsersScreen extends Component {
  constructor(args) {
    super(args);
    this._rowRenderer = this._rowRenderer.bind(this);
    this._users = userService;
    this.state = {
      appState: AppState.currentState,
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
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
      limit: 30,
      hasNextPage: true,
      isLoading: false,
    };
  }

  _fetchMoreData = async () => {
    if (!this.state.isLoading && this.state.hasNextPage) {
      this.state.isLoading = true;
      const res = await userService.getUsers(this.state.limit, this.state.page, filterStore.fitler);
      this.state.isLoading = false;
      this.setState({
        appState: AppState.currentState,
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

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active/) && nextAppState === 'active') {
      this.setState({ data: [], page: 1, }, this._fetchMoreData);
    }
  }

  componentDidMount() {
    this._fetchMoreData();
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      this.setState({ data: [], page: 1, }, this._fetchMoreData);
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <View style={styles.container}>
        <Notification />
        <FilterBox
          setFilter={async () => {
            this.listView.scrollToOffset(0, 0, false)
            this.setState({
              data: [],
              page: 1,
            }, this._fetchMoreData);
          }} />
        <FilterButton />
        <Admob />
        {this.state.totalDocs > 0
          ?
          <View style={styles.list}>
            <RecyclerListView
              ref={ref => { this.listView = ref }}
              style={{ flex: 1 }}
              contentContainerStyle={{}}
              initialRenderIndex={0}
              disableRecycling={true}
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
                        page: 1,
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

if (Platform.OS === 'android') {
  UsersScreen.navigationOptions = {
    header: null,
  };
} else {
  UsersScreen.navigationOptions = {
    headerTitle: (
      <Image style={{ width: 30, height: 30 }} source={require('./../assets/images/header.png')} />
    ),
  };
}

const styles = {
  container: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1
  },
  list: {
    flex: 1
  },
};