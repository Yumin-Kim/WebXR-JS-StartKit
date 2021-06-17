module.exports = {
  aceeptUserOrderTable,
};
const Insert_order_list =
  "insert into user_order_itemlist(user_id,product_id,createdAt) values(?,?,?)";
async function aceeptUserOrderTable(conn, result) {
  try {
    const AsyncPromiseAll = result.map(value => {
      return new Promise((resolve, reject) => {
        conn.query(Insert_order_list, value, (error, row, field) => {
          if (error) {
            reject(error);
          } else {
            resolve("success");
          }
        });
      });
    });
    return await Promise.all(AsyncPromiseAll);
  } catch (error) {
    console.error(error);
    return error;
  }

  //   await conn.query(Insert_order_list);
}
