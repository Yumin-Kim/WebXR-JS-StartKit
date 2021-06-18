# 안드로이드 과제를 위한 서버

- 비즈니스 요구 사항
  - 구매한 사용자 목록
  - 사용자 클릭시 날짜 별로 구매한 목록 확인가능
- 데이터 베이스
  - member_order_itemlist
    - 사용자와 목록간의 관계
    - user_id , 품목 , created
- 비즈니스 로직
  _ 구매
  _ 구매하면 해당 데이터전송받게 되는데 아직 정의되지 않았다. \* 전송 받을 데이터
  `{"result" :{ "used_id":"", "products":[ { "product_id":"123123" } ] }}`

* 생성날짜는 자동으로 찍히게 구현

  ````

          ```
      * [구매자 목록 전송]member_order_itemlist 전송하지만 중복은 제거하여 json데이터로 전송
      * [사용자 구매 목록 확인]member_order_list의 user_id를 통해 정보 전송
          * 중복되는 제품이 있으면 count하여 전송
          ```
          ["result": {
              "data":"2020...",
              "products":[{
                  "category":"",
                  "p_name" : "name",
                  "price":123123,
              }]
              "sumproductsprice":123123
          }]
          ```
  ````

* GET /admin/order

```
{
    "result": [
        {
            "user_id": "11111",
            "phone_number": "11111",
            "name": "111111"
        },
        {
            "user_id": "2016103092",
            "phone_number": "123123",
            "name": "123123"
        },
        {
            "user_id": "2016103095",
            "phone_number": "asdaslkjdlas",
            "name": "123123"
        }
    ]
}
```

- /admin/detail/:user_id

```
{
    "result": [
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "프리미엄 베이비스쿨",
            "price": 360000,
            "display": 0,
            "count": 3
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "프리미엄 바탕놀잇감",
            "price": 380000,
            "display": 1,
            "count": 3
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "영아다중 에듀",
            "price": 598000,
            "display": 2,
            "count": 2
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "다중지능 에듀1",
            "price": 648000,
            "display": 5,
            "count": 1
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "준은물",
            "price": 598000,
            "display": 9,
            "count": 1
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "영아토탈-교구",
            "price": 880000,
            "display": 4,
            "count": 1
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "은물",
            "price": 598000,
            "display": 8,
            "count": 1
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "마더구즈",
            "price": 380000,
            "display": 10,
            "count": 1
        },
        {
            "user_id": "11111",
            "createdAt": "2021-06-17T00:00:00.000Z",
            "category": "프뢰벨",
            "name": "테마동화II(책)",
            "price": 499000,
            "display": 12,
            "count": 1
        }
    ]
}
```
