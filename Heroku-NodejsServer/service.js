const repository = require("./repository");

module.exports = {
  addOrderInfo,
  getAdminOrderList,
  getDetailOrderInfo,
};

async function addOrderInfo(conn, requestdata) {
  const { product_id, user_id } = requestdata;
  const date = new Date().toISOString().match(/[^T|Z|/.]*/g);
  let inputParseData = [];
  product_id.map(v => {
    inputParseData.push([user_id, v, date[0]]);
  });
  const insertTranscation = await repository.aceeptUserOrderTable(
    conn,
    inputParseData
  );
  if (product_id.length === insertTranscation.length)
    return { result: "sucess" };
}

async function getAdminOrderList(conn) {
  const getorderList = await repository.aceeptOrderListtable(conn);
  const filterDuplicateOrderUser = await getorderList.reduce(
    (prev, cur, index) => {
      //요소 존재시 필터링후 저장
      if (prev.length !== 0) {
        const user_idCollection = prev.map(value => Object.values(value)[0]);
        if (!user_idCollection.includes(cur.user_id)) prev.push(cur);
      } else {
        prev.push(cur);
      }
      return prev;
    },
    []
  );
  return { result: filterDuplicateOrderUser };
}

async function getDetailOrderInfo(conn, user_id) {
  const AccessRepoDetailOrderInfo = await repository.acceptDetailOrderInfo(
    conn,
    user_id
  );
  const data = await AccessRepoDetailOrderInfo.reduce((prev, cur, index) => {
    if (prev.length !== 0) {
      const rowDisplayData = prev.map(value => Object.values(value)[5]);
      if (!rowDisplayData.includes(cur.display)) {
        prev.push({ ...cur, count: 1 });
      } else {
        if (rowDisplayData.includes(cur.display)) {
          const equalDisplayIndex = prev.findIndex(value => {
            return value.display === cur.display;
          });
          ++prev[equalDisplayIndex].count;
        }
      }
    } else {
      prev.push({ ...cur, count: 1 });
    }
    return prev;
  }, []);
  return data;
}
