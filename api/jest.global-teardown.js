module.exports = async function globalTeardown() {
  const pg = global.__BOOKMARKED_EMBEDDED_PG__;
  if (pg) {
    await pg.stop();
  }
};
