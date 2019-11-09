import { observable, computed, action } from 'mobx';

class FilterStore {
  constructor() {
  }

  @observable isVisible = false;
  @observable ageMin = null;
  @observable ageMax = null;
  @observable gender = 'ALL';
  @observable location = null;

  @computed
  get fitler() {
    let q = {};
    if (this.gender !== 'ALL') Object.assign(q, { gender: this.gender });
    return JSON.stringify(q);
  }

  @action async setMsgBox(boolean) {
    this.isVisible = boolean;
  }
}

const store = new FilterStore();

export default store;
