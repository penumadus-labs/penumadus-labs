const createTable = () => `
  CREATE TABLE counter (
    name text,
    value int
  );
`
const insertRow = name => `
  INSERT INTO counter (
    name,
    value
  ) VALUES ("${name}", 0);
`

const read = name => `
  SELECT name, value
  FROM counter
  WHERE name = "${name}"
`

const update = name => `
  UPDATE counter
  SET value = value + 1
  WHERE name = "${name}"
    
`
const reset = name => `
    UPDATE counter
    SET value = 0
    WHERE name = "${name}"
`

module.exports = {
  createTable,
  insertRow,
  read,
  update,
  reset,
}
