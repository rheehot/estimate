# Estimate

[https://75mm.studio/estimate](https://75mm.studio/estimate.html)

75mm studio 가견적 시스템입니다.
회사에 문의하기 전에 클라이언트측에서 간단하게 견적을 계산할 수 있는 웹 소프트웨어 입니다.
이 견적서는 회사 문의전 미리 가격을 알아볼 수 있는 가견적서 이며 실제 견적과정에서 약간의 가격이 더 추가발생하게 됩니다.(프레임수, VAT..)

75mm studio는 민감한 클라이언트의 개인정보를 관리하지 않습니다.
사용자 로그인 기능이 없기 때문에 계정별로 각 값이 DB에 저장되지 않습니다.
간단하게 장바구니에 넣을 수 있으며 가견적 연산이 진행됩니다.
저장이 필요하다면 브라우저에서 pdf로 저장해주세요.

#### 사용되는 솔루션
- Amazon SNS
- CloudWatch
- S3
- CloudFront
- Route53

![diagram](figures/diagram.png)

#### 배 포
홈페이지에 배포하기 위해서는 publish 스크립트를 터미널에서 실행합니다.

```
$ ./publish.sh
```
