# 프로젝트 설정 및 실행 가이드

## 1. Docker Compose 빌드 및 실행

docker compose build --no-cache
docker compose up

## 2. Remix IDE에서 계약 컴파일 및 배포
- Remix IDE에서 contracts/PlayerScores.sol 파일을 컴파일합니다.
- (.sol 코드 변경 시, ABI를 복사하여 contract_abi.json에 붙여넣습니다.)
- Deploy 탭을 클릭합니다.
- Environment에서 Dev ganache를 선택합니다.
- Deploy 버튼을 클릭합니다.
- 배포 후 얻은 주소를 복사하여 .env 파일의 CONTRACT_ADDRESS= 뒤에 붙여넣습니다.
- from으로 시작하는 주소를 복사하여 .env 파일의 ACCOUNT_ADDRESS= 뒤에 붙여넣습니다.

## 3. 중요
- .env 파일 수정 후! 터미널에 아래처럼 명령어 입력
- "docker stop tsen-backend-1" 입력 이후에
- "docker-compose up -d backend" 입력

## 4. 게임을 한 판 진행하여 승리합니다.

## 5. 블록체인 점수를 확인합니다.