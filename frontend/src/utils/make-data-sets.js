function transpose(a) {
  let w = a.length || 0;
  let h = a[0] instanceof Array ? a[0].length : 0;
  if (h === 0 || w === 0) {
    return [];
  }
  let i,
    j,
    t = [];
  for (i = 0; i < h; i++) {
    t[i] = [];
    for (j = 0; j < w; j++) {
      t[i][j] = a[j][i];
    }
  }
  return t;
}

function makeDataSets(data) {
  data = transpose(data);

  const dataSets = {};

  for (const row of data) {
    const key = row[0];
    const data = row.slice(1).map(x => ({ [key]: x === '' ? 0 : x }));
    dataSets[key] = { key, data };
  }
  return dataSets;
}

export default makeDataSets;
