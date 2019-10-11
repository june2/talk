import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { observer } from 'mobx-react';
import userStore from '../stores/UserStore';

let { width } = Dimensions.get("window");

@observer
export default class UsersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: new LayoutProvider(
        index => 0,
        (type, dim) => {
          dim.width = width;
          dim.height = 68;
        }
      ),
      images: [],
      count: 0,
      viewType: 0,
    };
    this.inProgressNetworkReq = false;
  }
  componentWillMount() {
    this.fetchMoreData();
  }
  async fetchMoreData() {
    if (!this.inProgressNetworkReq) {
      //To prevent redundant fetch requests. Needed because cases of quick up/down scroll can trigger onEndReached
      //more than once
      this.inProgressNetworkReq = true;
      const images = await userStore.getUsers();
      // const images = await DataCall.get(this.state.count, 20);
      this.inProgressNetworkReq = false;
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(
          this.state.images.concat(images)
        ),
        images: this.state.images.concat(images),
        count: this.state.count + 20,
      });
    }
  }
  rowRenderer = (type, data) => {
    //We have only one view type so not checks are needed here
    return <Text>{data.name}</Text>;
  };
  viewChangeHandler = viewType => {
    //We will create a new layout provider which will trigger context preservation maintaining the first visible index
    this.setState({
      layoutProvider: LayoutUtil.getLayoutProvider(viewType),
      viewType: viewType,
    });
  };
  handleListEnd = () => {
    this.fetchMoreData();

    //This is necessary to ensure that activity indicator inside footer gets rendered. This is required given the implementation I have done in this sample
    this.setState({});
  };
  renderFooter = () => {
    //Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    //The empty view can be removed once you've fetched all the data
    return this.inProgressNetworkReq
      ? <ActivityIndicator
        style={{ margin: 10 }}
        size="large"
        color={'black'}
      />
      : <View style={{ height: 60 }} />;
  };

  render() {
    //Only render RLV once you have the data
    return (
      <View style={styles.container}>
        {this.state.count > 0
          ? <RecyclerListView
            style={{ flex: 1 }}
            contentContainerStyle={{ margin: 3 }}
            onEndReached={this.handleListEnd}
            dataProvider={this.state.dataProvider}
            layoutProvider={this.state.layoutProvider}
            rowRenderer={this.rowRenderer}
            renderFooter={this.renderFooter}
          />
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
});
