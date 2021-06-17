const repository = require("./repository");

module.exports = {
  addOrderInfo,
  getAdminOrderList,
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
  const getorderList = await repository.aceeptUserOrderTable(conn);
}
