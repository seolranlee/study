# 8장 DOM과 브라우저 패턴

## 8.5 원격 스크립팅
최신의 웹애플리케이션들은 현재 페이지를 다시 로드하지 않으면서 서버와 통신하기 위해 원격 스크립팅을 자주 사용한다. 이를 통해 웹애플리케이션은 마치 데스크탑 애플리케이션처럼 빠르게 반응하게 된다. 

자바스크립트에서 서버와 통신할 수 있는 몇가지 방법을 알아보자.

### XMLHttpRequest
- MDN Web docs 참고
https://developer.mozilla.org/ko/docs/XMLHttpRequest

XMLHttpRequest는 자바스크립트에서 HTTP 요청을 생성하는 특별한 객체**(생성자 함수)**로, 현재 대부분의 브라우저에서 사용 가능하다. HTTP 요청을 만드는 과정은 다음 세 단계로 이루어진다.

- 1. XMLHttpRequest객체(줄여서 XHR이라고도 한다.)를 설정한다.

```javascript
var xhr = new XMLHttpRequest();
```

하지만 IE 7버전 이하에서는 XHR기능이 **ActiveX 객체(타입을 체크해보면 함수가 아닌 것이다.)**로 구현되었기 때문에 별도의 처리가 필요하다.

```javascript
if( typeof XMLHttpRequest === 'function'){
  xhr = new XMLHttpRequest();
} else {  // IE 7 이전 버전
  // 

  for(i = 0; i < activeXids.length; i += 1){
    try{
      xhr = new ActivexObject(activeXids[i]);
      break;
    } catch (e) {}
  } // IE 7버전 이하에서는 XHR기능이 ActiveX 객체로 구현

}
```

- 2. 응답 객체의 상태가 변경될 때 알림을 받기 위한 콜백 함수를 지정한다.

두 번째단계에는 readystatchange 이벤트에 대한 콜백 함수를 지정한다.

```javascript
xhr.onreadystatechange = handleResponse;
```

- 3. 요청을 보낸다.

마지막 단계에는 open()과 send() 두 메서드를 사용해 요청을 보낸다. 
**open()메서드**는 **GET**이나 **POST**같은 HTTP **요청 방식**과 **URL**을 설정한다.
open()의 마지막 매개변수로 **요청의 비동기 여부**를 지정한다. 비동기 방식인 경우 응답을 기다리는 동안 브라우저가 중단되지 않는다. 따라서 반드시 필요한 경우가 아니라면 비동기 매개변수를 항상 true로 사용해 더 나은 사용자 경험을 제공해야 한다.

**send()메서드**에는 **POST 데이터**를 인자로 전달하고 **GET 방식**인 경우 빈 문자열을 인자로 전달한다. 

```javascript
xhr.open('GET', 'page.html', true);
xhr.send();
```

다음 예제는 새로운 페이지의 내용을 가져와서 현재 페이지에 업데이트 한다. (데모는 http://www.jspatterns.com/book/8/xhr.html에서 확인할 수 있다.)


전체 코드

```javascript
var i, xhr, activeXids = [
  'MSXML2.XMLHTTP.3.0',
  'MSXML2.XMLHTTP',
  'Microsoft.XMLHTTP'
];
if( typeof XMLHttpRequest === 'function'){
  xhr = new XMLHttpRequest();
} else {  // IE 7 이전 버전
  // 

  for(i = 0; i < activeXids.length; i += 1){
    try{
      xhr = new ActivexObject(activeXids[i]);
      break;
    } catch (e) {}
  } // IE 7버전 이하에서는 XHR기능이 ActiveX 객체로 구현

}

var handleResponse = function(){
  if(xhr.readyState !== 4){ return false }
    // 콜백 함수는 xhr객체의 readyState 프로퍼티를 확인한다. readyState 프로퍼티값은 0부터 4까지 다섯 가지 값을 가질 수 있다. 4는 '완료'되었음을 의미한다. 아직 완료되지 않은 상태 값을 가지면, 다음 readystatechange 이벤트가 발생할 때까지 계속 대기한다.
  if(xhr.status !== 200 ) {
    alert('Error, status code:' + xhr.status);
    return false;
  }
  // 콜백 함수는 xhr객체의 status 프로퍼티도 확인한다. 이 프로퍼티는 HTTP 상태코드에 상응한다. 예를 들어 200(OK)이나 404(Not found) 값을 가진다. 오직 200 응답 코드에 대해서만 반응하고 다른 모든 응답코드는 오류로 처리한다. (간단한 처리를 위해 이렇게 하지만, 필요한 경우 다른 상태코드를 확인해 적절히 처리할 수도 있다. )


  // 아래는 HTTP(하이퍼텍스트 전송 프로토콜) 응답 상태 코드의 목록이다.
  // 1xx (조건부 응답)
  // 2xx (성공)
  // 3xx (리다이렉션 완료)
  // 4xx (요청 오류)
  // 5xx (서버 오류)

  document.body.innerHTML += '<pre>' + xhr.responseText + '<\/pre>';
  }


  xhr.onreadystatechange = handleResponse;


  xhr.open('GET', 'page.html', true);
  xhr.send();


  // 로컬에서 실행하면 아래와 같은 오류가 뜬다?

  // dom_01.html:57 XMLHttpRequest cannot load file:///Users/seolseol-lee/Desktop/js%E1%84%83%E1%85%B5%E1%84%8C%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%91%E1%85%A2%E1%84%90%E1%85%A5%E1%86%AB/8%E1%84%8C%E1%85%A1%E1%86%BC%20DOM%E1%84%80%E1%85%AA%20%E1%84%87%E1%85%B3%E1%84%85%E1%85%A1%E1%84%8B%E1%85%AE%E1%84%8C%E1%85%A5%20%E1%84%91%E1%85%A2%E1%84%90%E1%85%A5%E1%86%AB/page.html. Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.

  // server에서 확인
  // http://seolran90.cafe24.com/xhr.html
```

###JSONP
원격 요청을 생성하는 또 다른 방법은 JSONP(JSON with padding)를 사용하는 방법이다. XHR과 달리 브라우저의 동일 도메인 정책의 제약을 받지 않는다. 따라서, 서드파티 사이트에서 데이터를 로딩할 수 있으므로 보안 측면에서의 영향을 고려하여 신중하게 사용해야 한다.

다음과 같은 종류의 문서가 XHR 요청에 대한 응답이 될 수 있다.


- XML 문서(예전에 많이 사용되었다.)
- HTML 조각(꽤 일반적으로 사용한다.)
- JSON 데이터(가볍고 편리하다.)
- 간단한 테스트 파일 또는 다른 파일

JSONP 요청에 대한 응답 데이터는 주로 JSON을 함수 호출로 감싼 형태다. 호출 될 함수의 이름은 요청할 때 함께 전달한다.

예를들어 JSONP 요청 URL은 보통 다음과 같은 형태다.

http://example.org/getdata.php?callback=myHandler

getdata.php는 웹페이지가 될 수도 있고 스크립트가 될 수도 있다. **callback 매개변수**에는 응답을 처리할 자바스크립트 함수를 지정한다.

요청 URL은 다음과 같이 동적으로 생성된 ``<script>`` 엘리먼트에 로드된다.

```javascript
var script = document.createElement('script');
script.src = url;
document.body.appendChild(script);
```

서버는 JSON 데이터를 콜백 함수의 인자로 전달해 응답한다. 최종적으로 이 스크립트가 실제로 페이지에 삽입되면, 다음과 같이 콜백 함수가 호출된다.

```javascript
myHandler({'hello': 'world'})
````

### JSONP 예제: Tic-tac-toe
Tic-tac-toe 게임 예제를 통해 JSONP의 동작을 살펴보자. 이 게임의 플레이어는 클라이언트(브라우저)와 서버다. 두 플레이어는 1부터 9사이의 임의의 숫자를 생성하는데, 서버가 숫자를 생성할 순서가 되면 JSONP로 값을 가져올 것이다.

(Tic-tac-toe게임 원리: 가로 세로 대각선으로 3개가 이어지면 이긴다.
https://cdn.namuwikiusercontent.com/storage/4f4dcec30bc3dc3bdea1496fd584bae557c476e867105bdf6702546a5e449cb10a6544c651366ba2a10bc5d9c5d5e87d6af730feff5ce391cd42932ccd6b7dbabac6ce6770af489163f97327f3e5917e?e=1505930823&k=CxXTLsx-lPbsF6g6W8GlCw)

예제게임은 http://jspatterns.com/book/8/ttt.html
에서 실행

```javascript
```

### 프레임과 이미지 비컨(Image Beacons)
프레임은 자바스크립트로 iframe을 생성하고 src에 URL을 지정하는 방식이다. 이 URL에는 데이터나 iframe 외부의 부모 페이지를 업데이트 하는 함수 호출을 포함할 수 있다.

원격 스크립팅의 가장 간단한 형태는 서버에 데이터를 보내기만 하고 응답을 필요로 하지 않는 것이다. 이런 경우에는 새로운 이미지를 만들고 이미지의 src를 서버의 스크립트로 지정하면 된다.

```javascript
new Image().src = 'http://example.org/some/page.php';
```

이 패턴이 이미지 비켠이다. 이 패턴은 서버에 로그를 남길 목적으로 데이터를 전송할 때 유용하다.(방문자의 정보를 수집할 때. 주로 고객의 정보를 수집하기 위해 메일에 많이 삽입하는 듯.)

이미지 비켠에 대한 좀 더 직관적인 설명은 아래 URL을 참조.

https://translate.google.co.kr/translate?hl=ko&sl=en&u=https://keen.io/docs/streams/image-beacon/&prev=search

## 8.6 자바스크립트 배포

### 스크립트 병합
빠르게 로딩되는 페이지를 구축하기 위한 첫 번째 규칙은 가능한 외부 자원의 수를 줄이는 것이다.(HTTP 요청은 비용이 많이 든다.) 이러한 규칙에 따라 자바스크립트의 측면에서 외부 스크립트 파일들을 병합하면 페이지 로딩 시간을 크게 줄일 수 있다. 

스크립트 병합은 **단순히 새로운 파일을 만들고 개별 파일의 내용을 하나로 붙여넣는 작업을 뜻한다.**(파일을 병합하면 디버깅이 어려워지기 때문에 개발 단계가 아닌 출시 직전에 적용)


스크립트 병합의 단점
- 출시 준비에 한 단계가 추가된다.(하지만 이는 쉽게 자동화 할 수 있다.)
- 캐싱으로 인한 이득을 보지 못할 수 있다. 여러 파일 중 파일 하나만 약간 수정하더라도 전체 캐싱을 무효화 하게 된다.
- 묶음을 구성하기 위한 명명 규칙 또는 버전 지정 패턴을 정할 필요가 있다.

주로 귀찮음과 관련된 단점들임. 즉 하면 좋다.

### 코드 압축과 gzip 압축
코드 압축의 효과는 **주석과 공백**을 얼마나 많이 사용했는지, 그리고 **어떤 압축 도구**를 사용햇는지에 따라서 달라진다. 하지만 평균적으로 파일 크기를 **50퍼센트**정도 줄일 수 있다.
또한 스크립트 파일을 항상 gzip압축을 적용해 전송해야 한다. 단 한번 gzip압축을 적용하도록 서버 설정을 변경하는 것으로 즉각적인 성능 향상을 기대할 수 있다.

gzip압축을 적용하기 위해서는 아래 코드를 웹 루트의 .htaccess파일에 추가하면 된다.

```
AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml
application/javascript application/json
````

gzip압축은 평균적으로 파일을 **70퍼센트**정도 작게 만든다. 


### Expires헤더
Expires 헤더 적용 또한 아래 코드를 웹 루트의 .htaccess파일에 추가하면 된다.이

```
ExpiresActive on
ExpiresByType application/x-javascript "access plus 10 years"
```

### CDN 사용
CDN은 콘텐츠 전송 네크워크를 말한다. CDN은 세계 곳곳의 서로 다른 여러 데이터에 파일의 복사본을 배치하여, 동일한 URL을 유지하면서도 더 빨리 사용자에게 전송해준다.

- 구글은 인기 있는 오픈 소스 라이브러리들을 CDN으로 제공한다.
- 마이크로소프는 jQuery와 자사 Ajax 라이브러리들을 제공한다.
- 야후는 YUI 라이브러리를 CDN으로 제공한다.

jQuery CDN
http://jquery.com/download/#using-jquery-with-a-cdn

## 8.7 로딩 전략
웹페이지에 스크립트를 포함시키는 방법은 간단하다. 다음과 같이 ``<script>``엘리먼트를 사용해 인라인 자바스크립트 코드를 쓰거나 src 속성에 개별 파일을 링크하면 된다.

```javascript
// 인라인 자바스크립트
<script>
  console.log('hello world');
</script>
// src 속성에 링크를 지정
<script src="external.js"></script>
```

하지만 고성능의 웹 애플리케이션을 만들기 위해서는 더 많은 사항들을 고려해야하고 다양한 로딩 패턴들에 대해서 알아두어야 한다.
시작하기에 앞서 개발자들이 자주 사용하는 ``<script>`` 엘리먼트의 일반적인 속성들을 먼저 살펴보자. 

###language="JavaScript"
language 속성의 값은 "JavaScript"와 같이 대문자를 포함하기도 하고 때로는 버전명과 함께 쓰이기도 한다. ``<script>``엘리먼트를 쓰는 것이 암묵적으로 자바스크립트의 사용을 의미하기 때문에 이 속성은 사용할 필요가 없다. 버전명 지정 또한 관습적인 실수이며 제대로 동작하지 않는다.

###type="text/javascript"
type 속성은 HTML4와 XMTML1 표준에서는 필수 속성이지만, 반드시 있어야 하는 것은 아니다. type값이 없더라도 브라우저는 자바스크립트로 간주하기 때문이다. HTML5에서는 type 속성이 필수가 아니다. **마크업 유효성 검사**를 통과하기 위해서가 아니라면, type 속성을 사용할 이유가 전혀 없다.

###defer
폭 넓게 지원되지는 않지만 defer 속성을 사용하면 외부 스크립트 파일을 다운로드 하는 동안 나머지 부분의 다운로드가 차단되는 현상을 피할 수 있다. (HTML5에는 조금 더 개선된 async 속성이 도입되었다.)

###<script> 엘리먼트의 위치
``<script>``엘리먼트는 **페이지 다운로드의 진행을 차단**한다. 브라우저는 여러 개의 요소들을 동시에 다운로드 하는데, 외부 스크립트를 만나면 해당 스크립트가 다운로드되고 파싱되어 실행될 때 까지 나머지 파일의 다운로드를 중단한다. 이 때문에 전체 페이지를 로드하는 데 걸리는 시간이 길어지며 특히 이런 현상이 여러 번 발생할 경우 더욱 심해진다.
다운로드 차단 현상을 최소화하기 위해서는 **``<script>`` 엘리먼트를 페이지의 맨 마지막 부분, 즉 닫는 ``</body>``태그 바로 앞에 위치**시켜야 한다. 이렇게 하면 다운로드가 차단될 만한 다른 리소스가 사라진다. 나머지 페이지 요소들을 이미 다운로드되어 사용자에게 보여지고 있을 것이다.

**최악의 안티패턴은 여러개의 외부 스크립트를 문서의 head에 선언하는 것**이다.


```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <!-- 안티패턴 -->
  <script src="jquery.js"></script>
  <script src="jquery.quickselect.js"></script>
  <script src="jquery.lighbox.js"></script>
  <script src="myapp.js"></script>
</head>
<body>
  ...
</body>
</html>
```

모든 스크립트 파일을 하나로 병합하는 것은 그나마 나은 방법이다.

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="bundle.js"></script>
</head>
<body>
  ...
</body>
</html>
```

가장 좋은 방법은 병합된 스크립트를 페이지의 맨 마지막에 두는 것이다.

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  ...
  <script src="bundle.js"></script>
</body>
</html>
```

### HTTP Chunked 인코딩 사용
HTTP 프로토콜은 소위 chunked 인코딩을 지원한다. 이를 이용해 페이지를 몇 조각으로 나누어 전송할 수 있다. 복잡한 페이지에 chunked 인코딩을 적용하면, 서버측 작업이 완전히 끝날 때까지 기다릴 필요 없이, 상대적으로 정적인 페이지 상단 부분을 먼저 정송하기 시작할 수 있다.

간단한 전략 중 하나로 페이지의 나머지 부분이 만들어지는 동안 ``<head>``부분을 첫 번째 조각으로 전송하는 방법이 있다. 다시 말해서 다음과 같은 형태가 될 수 있다.


```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<!-- 첫 번째 조각의 끝 -->
<body>
  ...
  <script src="bundle.js"></script>
</body>
</html>
<!-- 두 번째 조각의 끝 -->
```

자바스크립트를 다시 ``<head>``안에 집어 넣고 첫 번째 조각으로 전송하면 간단하게 조금 더 개선할 수 있다. 이렇게 하면 서버 측에서 페이지의 나머지 부분이 준비되는 동안 브라우저는 문서 상단부 head 안에 있는 스크립트 파일을 다운로드하기 시작한다.

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="bundle.js"></script>
</head>
<!-- 첫 번째 조각의 끝 -->
<body>
  ...
</body>
</html>
<!-- 두 번째 조각의 끝 -->
```

페이지 맨 마지막에 세 번째 조각을 두어 스크립트만 모아놓고 전송하는게 가장 좋은 방법. 모든 페이지의 상단이 어느 정도 정적인 내용으로 구성되어 있다면 첫 번째 조각에 본문 ``<body>``의 일부분까지 포함시킬 수도 있다.

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<!-- 첫 번째 조각의 끝 -->
<body>
  <div id="header">
    <img src="logo.png" alt="">
    ...
  </div>
  <!-- 첫 번째 조각의 끝 -->
  <!-- 페이지 본문 전체 -->
  <!-- 두 번째 조각의 끝 -->
  <script src="bundle.js"></script>
</body>
</html>
<!-- 세 번째 조각의 끝 -->
```

이 접근 방법은 점진적인 개선과 무간섭적인 자바스크립트의 원칙에도 잘 들어맞는다 두 번째 HTML조각까지 완료된 직후에는 마치 브라우저에서 자바스크립트를 비활성화시킨 상태처럼 페이지가 완전히 로드되어 화면에 표시되고 사용가능 해야한다. 그리고 나서 세 번째 조각이 완료되면, 자바스크립트가 페이지를 햐상시키고 부가기능을 덧붙인다.


### 다운로드를 차단하지 않는 동적인 ``<script>``엘리먼트
자바스큷티는 뒤이어 오는 파일들의 다운로드를 차단한다. 하지만 이를 방지할 수 있는 몇 가지 패턴이 있다.

- XHR 요청으로 스크립트를 로딩한 다음 응답 문자열에 ``eval()``을 실행시키는 방법. 동일 도메인 제약이 따르고 그 자체로 안티패턴인 ``eval()``을 사용해야 한다는 단점이 있다.
- defer와 async 속성을 사용하는 방법. 일부 브라우저에서만 동작한다.
- ``<script>``엘리먼트를 동적으로 생성하는 방법

마지막에 언급한  ``<script>``엘리먼트를 동적으로 생성하는 방법이 가장 좋고 쓸만한 패턴. JSONP에서 했던 것과 비슷하게 새로운 ``<script>``엘리먼트를 생성하고 src속성을 지정해 페이지에 동적으로 붙인다.
다음은 다른 파일의 다운로드를 차단하지 않고 자바스크립트 파일을 비동기적으로 로드하는 예이다.

```javascript
var script = document.createElement('script');
script.src = 'bundle.js';
document.documentElement.firstChild.appendChild(script);
//documentElement는 <html>을 가리키고 그 첫번째 자식은 <head>
```

그러나 이 패턴을 적용하여 메인.js 파일을 로드하는 동안에는, 이 파일에 의존하여 동작하는 다른 스크립트 엘리먼트를 쓸 수 없다는 단점이 있다. 비동기 방식임로 언제 로드가 완료될지 보장할 수 없고 뒤이어 선언된 스크립트가 아직 정의되지 않은 객체를 참조할 수 있기 때ㅜㅁㄴ이다.
이 문제를 해결하려면 모든 인란인 스크립트를 바로 실행하는 대신 배열 안의 함수로 모아두어야 한다. 그리고 나서 비동기로 js 파일을 받고난 뒤 버퍼 배열 안에 모아진 모든 함수를 실행한다. 

첫번째로, 모든 인라인 코드르 저장해 둘 배열을 가능한 한 페이지의 최상단에 만든다.

```javascript
var mynamespace={
  inline_scripts: []
};
```

그리고 나서 각 인라인 스크립트를 함수로 감싸 inline_scripts 배열 안에 넣는다.

```javascript
// 수정 전:
<script>console.log('I am Inline')</script>

// 수정 후:
<script>
mynamespace.inline_scripts.push(function(){console.log('I am Inline')});
</script>
```

마지막 단계에는 비동기로 로드된 js스크립트가 인라인 스크립트의 버퍼 배열을 순회하면서 배열 안의 모든 함수를 실행한다.

```javascript
var i, scripts = mynamespace.inline_scripts, max = scripts.length;
for(i = 0; i < max; max += 1){
  scripts[i]();
}
```

### ``<script>``엘리먼트 붙이기
일반적으로 스크립트는 문서의 ``<head>``에 추가된다. 그러나 스크립트는 ``<body>``를 포함한 어떤 엘리먼트에도 붙일 수 있다.

```javascript
document.documentElement.firstChild.appendChild(script);
//documentElement는 <html>을 가리키고 그 첫번째 자식은 <head>
```

다음과 같은 방법도 일반적

```javascript
document.getElementsByTagName('head')[0].appendChild(script);
```

마크업을 직접 제어하고 있다면 문제가 없으나, 어떤 구조의 페이지에 삽입될지 알 수 없다면 ``document.body``로.(``<body>``가 없이도 대부분 확실히 동작)

```javascript
document.body.appendChild(script);
```

페이지에서 스크립트를 실행한다는 건 최소 하나의 스크립트 태그가 존재한다는 것. 이를 이용해 페이지 내에서 찾아낸 첫번째 엘리먼트에 ``insertBefore()``로 스크립트를 붙일 수도 있다.

```javascript
var script = document.createElement('script');
script.src = 'bundle.js';
var first_sript = document.getElementsByTagName('script')[0];
first_sript.parentNode.insertBefore(script, first_sript)
```

여기서 first_sript는 페이지 내에 존재하는 스크립트 엘리먼트, script는 새로 생성한 스크립트 엘리먼트.


### 게으른 로딩
게으른 로딩은 외부 파일을 페이지의 load이벤트 이후에 로드하는 기법. 대체로 큰 묶음의 코드를 다음과 같이 두 부분으로 나눈 것이 유리.

- 페이지를 초기화 하고 이벤트 핸들러를 UI 엘리먼트에 붙이는 **핵심 코드**를 첫번째 부분으로 정한다.
- 사용자 인터랙션이나 다른 조건들에 의해서만 (사용자의 동작에 의해 작동하는)필요한 코드를 두 번째 부분으로 나눈다.

게으른 로딩의 목적은 페이지를 **점진적으로 로드하고**가능한 빨리 무언가를 동작시켜 사용할 수 있게 하는 것. 나머지는 사용자가 페이지를 살펴보는 동안 백그라운드에서 로드.


```javascript
<!-- 페이지의 전체 본문 -->
<script src='test.js'></script>
<!-- 두번째 조각의 끝 -->
<script>
  window.onload = function(){
    var script = document.createElement('script');
    script.src = 'lazyload.js';
    document.documentElement.firstChild.appendChild(script);
  };
</script>
</body>
</html>
<!-- 세 번째 조각의 끝 -->
```

### 주문형 로딩
게으른 로딩의 개선 코드. 사용자가 어떤 동작을 문서에 접속 후 한번도 하지 않는다면? 주문형 로딩 패턴을 적용하면 이러한 경우 효율적으로 대응 가능.

로드할 스크립트의 파일명과, 이 스크립트가 로드된 후에 실행될 콜백 함수를 받은 ``require()``함수 또는 메서드를 만든다.

```javascript
require("extra.js", function() {
  functionDefinedInExtraJS();
});
```

이 함수의 구현법

```javascript
function require(file, callback) {
  var script = document.getElementsByIdTagName('script')[0],
      newjs = document.createElement('script');

  // IE
  newjs.onreadystatechange = function () {
    if (newjs.readyState === 'loaded' || newjs.readyState === 'complete') {
      newjs.onreadystatechange = null;
      callback();
    }
  };

  // 그외 브라우저
  newjs.onload = function () {
    callback();
  };

  newjs.src = file;
  script.parentNode.insertBefore(newjs, script);
}
```


- IE에서는 ``readystatchange`` 이벤트를 구독하고 ``readyState`` 값이 "loaded" 또는 "complete"인지 확인한다. 다른 모든 브라우저는 이를 무시한다.
- 파이어폭스, 사파리, 오페라에서는 ``onload`` 프로퍼티로 ``load`` 이벤트를 구독한다.
- 이 방법은 Safari 2버전에서는 동작하지 않는다. 이 브라우저도 지원해야 한다면 특정변수(추가적인 파일에서 선언된거)가 정의되었는지를 반복적으로 확인하도록 타이머로 시간 간격을 설정해야 한다. 정의가 되었다면, 새로운 스크립트가 로드되고 실행되었다는 뜻이다.


네트워크 지연을 흉내내기 위해 인위적으로 지연시킨 ondemnad.js.php라는 스크립트를 생성하여 구현을 테스트할 수 있다.

```php
<?php
  header('Content-Type: application/javascript');
  sleep(1);
?>
function extraFunction(logthis) {
  console.log('loaded and executed');
  console.log(logthis);
}
```

``require()`` 함수 테스트

```javascript
require('ondemand.js.php', function () {
  extraFunction('loaded from the parent page');
  document.body.appendChild(document.createTextNode('done!'));
});
```

http://jspatterns.com/books/7/ondemand.html 에서 확인가능.

### 자바스크립트 사전 로딩
이 방법은 현재 페이지에서는 필요하지 않지만 다음으로 이동하게 될 페이지에서 필요한 스크립트를 미리 로드할 수 있음. 사용자가 두번째 페이지에 도착했을 때 이미 스크립트가 로드되어 있기 때문에 전체적으로 더 빠른 속도를 경험.

그러나 스크립트가 이미 두 번째 페이지에서 실행되고 있다고 간주하여 에러가 발생할 수 있다. 예를 들어 특정 DOM 노드를 찾으려 한다면 에러가 발생할 것이다.

스크립트가 파싱되거나 실행되지 않게 로드할 수도 있다. 이 방법은 CSS나 이미지파일에도 적용할 수 있다.

IE에서는 이미지 비컨 패턴

```javascript
`new Image().src = "preloadme.js";
```

IE이외의 브라우저에서는 스크립트 엘리먼트 대신에 ``<object>`` 엘리먼트를 사용하고 data 속성 값에 로드할 스크립트의 URL을 가리키도록 지정하면 된다.


```javascript
var obj = document.createElement('object');
obj.data = "preloadme.js";
document.body.appendChild(obj);
```


``<object>``가 브라우저에 보이지 않게 하기 위해 width, height 값도 0으로 설정 범용의 preload() 함수나 메서드를 만들고 초기화 시점 분기 패턴(4장)으로 브라우저간의 차이를 처리할 수도 있다.


```javascript
var preload;
if (/*@cc_on!@*/false) { //조건 주석문으로 IE를 탐지
  preload = function (file) {
    new Image().src = file;
  };
} else {
  preload = function (file) {
    var obj = document.createElement('object'),
    body = document.body;
    obj.width = 0;
    obj.height = 0;
    obj.data = file;
    body.appendChild(obj);
  };
}

preload('my_web_worker.js'); 
```

이 패턴의 단점은 사용자 에이전트 탐지 코드를 포함한다는 것이다. 이 경우에는 기능 탐지로는 브라우저의 동작을 충분히 알 수 없기 때문에 불가피한 경우에만 사용해야 한다.