module.exports = {
  aceeptUserOrderTable,
  aceeptOrderListtable,
  acceptDetailOrderInfo,
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
const user_products =
  "select u.user_id , u.phone_number , u.name from user as u join user_order_itemlist as o on o.user_id = u.user_id ";
async function aceeptOrderListtable(conn) {
  const data = new Promise((res, reject) => {
    conn.query(user_products, (error, row, field) => {
      if (error) {
        console.error(error);
      } else {
        res(row);
      }
    });
  });
  return await data;
}
const matchOrderInfo =
  "select u.user_id , u.createdAt , p.catagory as  category , p.p_name as name , p.price as price ,p.display_num as display  from user_order_itemlist  as u join products as p on p.p_id = u.product_id where  u.user_id = ";
async function acceptDetailOrderInfo(conn, user_id) {
  const makeAsyncConnection = new Promise((resolve, reject) => {
    conn.query(matchOrderInfo + user_id, (error, row, field) => {
      if (error) {
        console.error(error);
      } else {
        resolve(row);
      }
    });
  });
  return await makeAsyncConnection;
}
