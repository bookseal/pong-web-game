# 프로젝트 이름

이 프로젝트는 Django와 ThreeJS를 사용하여 구축된 웹 애플리케이션으로, 42OAuth를 통한 원격 인증, 2FA 및 JWT 보안, 그리고 블록체인 기능을 포함하고 있습니다.

## 📚 목차

- **Major**
  1. Django
  2. Remote authentication (42OAuth)
  3. ThreeJS
  4. 2FA and JWT
  5. Blockchain 

- **Minor**
  1. Bootstrap
  2. PostgreSQL
  3. Game Customization Options (Ball Speed)
  4. Multiple languages support (en, ko, fr)

## 🚀 실행 가이드

1. **로그인**: 42OAuth API를 통해 로그인합니다.
2. **QR 코드 등록**: 구글 Authenticator와 같은 앱으로 QR 코드를 등록합니다.
3. **OTP 인증**: QR 코드 등록 후 제공된 OTP로 인증을 완료합니다.
4. **언어 설정**: 원하는 언어로 애플리케이션의 언어를 변경합니다.
5. **플레이어 생성**: 2명 이상의 새 플레이어를 만듭니다.
6. **게임 시작**: 토너먼트 또는 1:1 대전을 선택하여 게임을 시작합니다.
7. **블록체인 기록**: 게임에서 승리할 경우, 결과가 블록체인에 기록되며 조회가 가능합니다.
8. **로그아웃**: 서버와의 세션을 끊거나 로그아웃합니다.

## 🐳 도커 실행 가이드

프로젝트를 Docker로 실행하려면 다음 명령어를 사용하세요:

```bash
docker compose build --no-cache
docker compose up
```


## 🛠️ 기술 스택

- **Backend**
  - Django
  - PostgreSQL

- **Frontend**
  - ThreeJS
  - Bootstrap

- **Authentication**
  - 42OAuth
  - 2FA (Google Authenticator)

- **Security**
  - JWT (JSON Web Token)
  - Blockchain
