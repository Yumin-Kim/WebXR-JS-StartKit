# Heroku를 활용한 웹 호스팅

**[Heroku링크](https://heroku.com)**

## Heroku 세팅

- Heroku
- 헤로쿠(Heroku)는 PaaS(Platform as a Service)형태의 클라우드 서비스입니다.  
  헤로쿠는 터미널이나 웹에서 필요한 여러 티어(ex. DB)를 쉽게 생성하고 연동시킬 수 있습니다.  
  최초 버전에서는 Ruby 언어만 지원하였지만, 현재는 메이저급 언어 대부분을 지원하고 있습니다.
- Git 명령어로 앱을 배포함
- 애드온(Add-ons)
  - DB와 같은 여러 백엔드 서비스를 제공함(ex. redis, mongodb, mysql)
  - Elements 마켓장소에서 필요한 애드온을 찾아 설치할 수 있음
- 무료
  _ 30분 동안 사용하지 않는 경우에는 sleep 모드로 전환됨
  _ 재 접속시에는 wakeup하는 시간으로 응답시간이 늦어질 수 있음
  **운영체제에따라 다른게 설치 한다.**

```
    npm i heroku -g
    heroku login >> 브라우저를 사용해서 입력된다
```

- 간단하게 코드를 작성하되 pakeage.json에 script : start을 통한 서버 실행 코드를 작성해야한다. heroku에서 npm start을 기준으로 서버 코드가 실행된다.

```
    heroku create {원하는 프로젝트 명을 작성한다.}
    git add .
    git commit -m "first index.js"
    git push heroku master
    heroku open
```

- 위와 같이 진행하면 deploy가 가능하다.
- 기존의 git과 같이 사용하면 git push origin master // git push heroku master를 주의해서 작성해야한다.
  **간단한 heroku 명령어**

```
    heroku git:remote <프로젝트 명> [heroku git주소를 remote 하기위해서 ]
    heroku apps:rename newname [프로젝트 명을 작성하지 않으면 랜덤해서 생성되는데 구부분을 해결하기위한 명령어]
    heroku ps:scale web=1 [동작하고 있지 않으면 다음 명령어로 기동시킨다.]
    heroku logs --tail [Debugging]
```

## Heroku Mysql 연결

- Heroku에 claerDB를 사용하여 Mysql 사용
- 하기전에 카드 등록하는것을 까먹지 말자!!

```
    heroku addons:create claerdb:ignote
    heroku config //해당 코드를 통해서 db관련 세팅 값을 볼 수 있다 . hostname username password databasename 정보값을 확인할 수 있다.
```

- 비밀번호는 dotenv사용

* local workbancher를 사용하여 원격으로 제어할 수 있으며 CMD창 접근은 mysql -u {유저 정보} -h {호스트 정보} -p {비밀번호}

- 최대한 typescript활용하여 진행하기 javascript타입이 너무 자유로워서 진행에 어려움 발생

### 해당 프로젝트는 아니지만 진행함에 있어 겪은 문제

- mysql 과 node 연결상황에서 'Error: Connection lost: The server closed the connection.' 에러 발생
  - 해당 에러는 interactice_timeout , wati_timeout에 적혀 있는 시간 활동하지 않는 커넥션을 끊을때까지 서버가 대기하는 시간이 있는데 해당 요소로 인해 에러가 발생한다.
  - 기본 값은 서8시간 동안 활동하지 않으면 서버가 커넥션을 끊어 버린다는 것을 확인할 수 있으며 해당 문제를 setInterval을 통해서 해결할 수 있다.
- mysql과 node간의 문제 [해당 사이트 참고]()https://jhleed.tistory.com/104
  - DB connection간의 중복의 원인이며 createConnectioin이라는 mysql 라이브러리 API를 주의하여 사용해야한다.

#### 구현중 필요한 상식 , 참고 자료

- 호스팅 , 서버 호스팅 , 클라우드 차이(https://library.gabia.com/wp-content/uploads/2016/03/%EC%A0%95%EB%B3%B4%EC%82%AC%EC%9D%B4%ED%8A%B8-%ED%98%B8%EC%8A%A4%ED%8C%85003.jpg)
- [Heroku와 Node.js 세팅](https://advenoh.tistory.com/6)
- [Heroku와 Mysql연결 참고 자료\_1](https://donologue.tistory.com/371)
- [Heroku와 Mysql,workbench연결 참고 자료\_2](https://m.blog.naver.com/gofkdvjvl/222041889095)
- [Heroku와 MongoDB연결 참고 자료](https://poiemaweb.com/nodejs-heroku)
- [Node.js Mysql사용함에 있어 비동기 문제 해결 블로그](https://holywater-jeong.github.io/2018/06/08/node-mysql-async-await)
- [db사용간에 중요한 비밀번호 heroku내에서 숨기는 방법 블로그](https://gompro.postype.com/post/975726)

#### 해결해야하는부분

- DB사용간에 입력한 데이터 줄바꿈 어떻게 할건인지
- DB table작성
- SQL 문법
