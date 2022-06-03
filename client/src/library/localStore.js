import jwt from 'jwt-decode'

const LocalStore = {
  get: (key = "token") => {
    return localStorage.getItem(key);
  },

  set: (data, key = "token") => {
    let d = data;
  
    if (data && typeof data === "object") {
      d = JSON.stringify(data);
    }
    localStorage.setItem(key, d);
  },

  clear: (key = "token") => {
    localStorage.removeItem(key);
  },

  decodeToken: myToken => {
    try {
      const token = myToken || LocalStore.get();

      if (token) {
        return jwt(token);
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};

export default LocalStore;
