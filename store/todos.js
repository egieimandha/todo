import PouchyStore from 'pouchy-store';

class TodosStore extends PouchyStore {
  get name() {
    return this._name;
  }

  setName(userId) {
    this._name = `todos_${userId}`;
  }

  get urlRemote() {
    return 'http://13.250.43.79:5984/';
  }

  get optionsRemote() {
    return {
      auth: {
        username: 'admin',
        password: 'iniadmin',
      },
    };
  }

  sortData(data) {
    data.sort((one, two) => {
      const oneTs = one.createdAt;
      const twoTs = two.createdAt;
      if (oneTs > twoTs) {
        return -1;
      }
      if (oneTs < twoTs) {
        return 1;
      }
      return 0;
    });
  }
}

export default new TodosStore();
