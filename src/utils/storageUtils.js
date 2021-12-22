const storeData = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getData = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (e) {
    // error reading value
  }
};

export { storeData, getData };
