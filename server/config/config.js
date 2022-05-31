const dbName = 'dbLearnNepal';

module.exports = {
  allowedRoles: ["root", "admin", "user"],
  /* Related to token */
  tokenKey: 'jf9sugsdngsd#^lgorit937=constdecrypt=',
  tokenLife: 4 * 60 * 60 * 1000, // should be in "ms"
  /* Related to DB */
  dbUrl: `mongodb://localhost:27017/${dbName}`,
  dbOptions: {
    useNewUrlParser: true, // when true port must be specified in url
    useUnifiedTopology: true, // default: false, enable mongodb's connection management engine
    autoIndex: true, // build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // default: 30000, Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  },
};
