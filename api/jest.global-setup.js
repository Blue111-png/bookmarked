const path = require("path");
const { execSync } = require("child_process");
const EmbeddedPostgres = require("embedded-postgres").default;

const TEST_DB_PORT = 55432;
const TEST_DATABASE_URL = `postgresql://bookmarked_test:bookmarked_test@localhost:${TEST_DB_PORT}/bookmarked_test`;

module.exports = async function globalSetup() {
  const pg = new EmbeddedPostgres({
    databaseDir: path.join(__dirname, ".tmp-test-pgdata"),
    user: "bookmarked_test",
    password: "bookmarked_test",
    port: TEST_DB_PORT,
    persistent: false,
  });

  await pg.initialise();
  await pg.start();
  await pg.createDatabase("bookmarked_test");

  // Apply the real migration history (not just `db push`) so tests also
  // catch a broken migration file, same as production would hit.
  execSync("npx prisma migrate deploy", {
    cwd: path.join(__dirname),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: "inherit",
  });

  process.env.DATABASE_URL = TEST_DATABASE_URL;

  // Bridge the running instance to globalTeardown, which runs in the same
  // Jest orchestrator process but a separate module scope.
  global.__BOOKMARKED_EMBEDDED_PG__ = pg;
};
