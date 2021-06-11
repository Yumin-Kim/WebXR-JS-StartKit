const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

dotenv.config();

app.use("/", express.static("public/examples"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const insertData = [
  ["프뢰벨", "프리미엄 베이비스쿨", "360000"],
  ["프뢰벨", "프리미엄 바탕놀잇감", "380000"],
  ["프뢰벨", "영아다중 에듀", "598000"],
  ["프뢰벨", "영아토탈-교재", "590000"],
  ["프뢰벨", "영아토탈-교구", "880000"],
  ["프뢰벨", "다중지능 에듀1", "648000"],
  ["프뢰벨", "다중지능 에듀2", "698000"],
  ["프뢰벨", "다중지능 에듀3", "698000"],
  ["프뢰벨", "은물", "598000"],
  ["프뢰벨", "준은물", "598000"],
  ["프뢰벨", "마더구즈", "380000"],
  ["프뢰벨", "테마동화", "599000"],
  ["프뢰벨", "테마동화II(책)", "499000"],
  ["프뢰벨", "피터래빗과 친구들", "149000"],
  ["프뢰벨", "영아테마동화", "490000"],
  ["프뢰벨", "자연다큐", "490000"],
  ["프뢰벨", "뉴컨셉동화", "499000"],
  ["프뢰벨", "디즈니 주니어백과", "299000"],
  ["프뢰벨", "디즈니 자이언트명작", "530000"],
  ["프뢰벨", "생각쓰기", "499000"],
  ["프뢰벨", "생각지식그림책", "299000"],
  ["프뢰벨", "고사이언스", "419000"],
  ["프뢰벨", "수과학동화", "499000"],
  ["프뢰벨", "뉴말하기 프로그램", "349000"],
  ["프뢰벨", "읽기 프로그램", "449000"],
  ["프뢰벨", "언어 원리 동화", "260000"],
  ["프뢰벨", "퍼포먼스 0", "399000"],
  ["프뢰벨", "퍼포먼스 1", "899000"],
  ["프뢰벨", "퍼포먼스(2)-A(기기O)", "939000"],
  ["프뢰벨", "퍼포먼스(2)-B(기기X)", "599000"],
  ["프뢰벨", "토킹 클래식", "220000"],
  ["프뢰벨", "토킹 클래식", "250000"],
  ["프뢰벨", "우리역사 파노라마", "599000"],
  ["프뢰벨", "어린이 경제동화", "349000"],
  ["프뢰벨", "수+과학 프로그램", "530000"],
  ["프뢰벨", "영아 수학 동화", "199000"],
  ["프뢰벨", "메타 인지 발달 놀잇감", "380000"],
  ["프뢰벨", "리딩논픽션", "299000"],
  ["프뢰벨", "리딩논픽션(DVD)", "257000"],
  ["프뢰벨", "푸와 멋진 친구들", "199000"],
  ["프뢰벨", "오감 하우스", "1578000"],
  ["프뢰벨", "상상 하우스", "1845000"],
  ["프뢰벨", "창의 하우스", "1745000"],
  ["프뢰벨", "명작동화", "449000"],
  ["프뢰벨", "지혜하우스", "1496000"],
  ["프뢰벨", "인물동화", "449000"],
  ["프뢰벨", "전래동화(한국)", "449000"],
  ["프뢰벨", "전래동화(합본)", "698000"],
  ["프뢰벨", "씽크 인 잉글리쉬 런1", "199000"],
  ["프뢰벨", "씽크 인 잉글리쉬 런2", "199000"],
  ["프뢰벨", "스토리알파벳", "219000"],
  ["프뢰벨", "씽크 인 잉글리쉬 점프1", "199000"],
  ["프뢰벨", "씽크 인 잉글리쉬 점프2", "199000"],
  ["프뢰벨", "액팅 파닉스", "219000"],
  ["프뢰벨", "씽킹펜", "99000"],
  ["시사", "스토리킹덤", "480000"],
  ["시사", "붐붐 잉글리쉬", "790000"],
  ["시사", "내셔럴 지오그라픽", "240000"],
  ["시사", "월드 윈도우", "360000"],
  ["옹달샘", "한자-교재", "360000"],
  ["옹달샘", "한자-교구", "370000"],
  ["옹달샘", "한자-활동집", "100000"],
  ["옹달샘", "쇼매쓰", "698000"],
  ["옹달샘", "매쓰온매쓰", "498000"],
];

setInterval(function () {
  conn.query("SELECT 1");
}, 5000);
// pool.connect()
// console.log(pool.query("select * from user"))
const insertSQL =
  "INSERT INTO user (user_id, name, passwd, access_code, dept, sub_dept, phone_number) VALUES (?, ?, ?, 3, ?, ?, ?)";
const Insert_productSQL =
  "insert into products (catagory,p_name,price,display_num) values(?,?,?,?)";
app.post("/insertproduct", async (req, res) => {
  const AsyncData = insertData.map((el, index) => {
    el.push(index);
    return new Promise(() =>
      conn.query(Insert_productSQL, el, (error, row, field) => {
        if (error) {
          console.error(error);
        } else {
          console.log(row);
          console.log(field);
        }
      })
    );
  });
  await Promise.all(AsyncData);
});
app.get("/readproduct", async (req, res) => {
  const selectSQL = "select * from products order by display_num";
  await conn.query(selectSQL, (error, row, field) => {
    if (error) console.error(error);
    else {
      res.json(row);
    }
  });
});
app.post("/signup", async (req, res) => {
  const data = req.body;
  const parseData = Object.values(JSON.parse(data.json)).reduce(
    (prev, cur, index) => {
      prev.push(cur);
      return prev;
    },
    []
  );
  console.log(parseData);
  await conn.query(insertSQL, parseData, (error, row, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(row);
      console.log(fields);
      res.json({ operation: "sucess" });
    }
  });
});
app.post("/dropuser", (req, res) => {
  const data = req.body;
  const parseData = JSON.parse(data.json);
  conn.query(
    `select * from user where user_id=${parseData.user_id}`,
    (error, row) => {
      console.log(row);
      if (row !== undefined) {
        if (row.length === 0) {
          res.json({ operation: "failure" });
        } else {
          conn.query(
            `delete from user where user_id=${parseData.user_id}`,
            (error, row) => {
              res.json({ operation: "sucess" });
            }
          );
        }
      } else {
        res.json({ operation: "failure" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const data = req.body;
  const parseData = JSON.parse(data.json);
  conn.query(
    `select * from user where user_id=${parseData.user_id} and passwd=${parseData.pwd}`,
    (error, row) => {
      if (row !== undefined) {
        if (row.length === 0) {
          res.json({ login: "NO" });
        } else {
          res.json({
            login: "YES",
            user_id: row[0].user_id,
            user_name: row[0].name,
          });
        }
      } else {
        res.json({ login: "NO" });
      }
    }
  );
});
app.post("/logout", (req, res) => {
  res.send("clear");
});
app.post("/changepassword", (req, res) => {
  const data = req.body;
  const parseData = JSON.parse(data.json);
  console.log(parseData);
  conn.query(
    `select * from user where user_id=${parseData.user_id} and passwd=${parseData.pwd}`,
    (error, row) => {
      if (row !== undefined) {
        if (row.length === 0) {
          res.json({ operation: "failure" });
        } else {
          conn.query(
            `update user set passwd=${parseData.newpwd} where user_id=${parseData.user_id}`,
            (error, row) => {
              res.json({ operation: "sucess" });
            }
          );
        }
      } else {
        res.json({ operation: "failure" });
      }
    }
  );
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/examples/physics/index.html");
});
app.listen(PORT, () => {
  console.log("Start");
});
