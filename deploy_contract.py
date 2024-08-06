import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_project.settings')
django.setup()

from game.blockchain_utils import deploy_contract

def main():
    contract_address = deploy_contract()
    print(f"Contract deployed at: {contract_address}")
    
    # 환경 변수에 컨트랙트 주소 설정
    os.environ['CONTRACT_ADDRESS'] = contract_address
    
    # .env 파일 업데이트
    with open('.env', 'a') as f:
        f.write(f"\nCONTRACT_ADDRESS={contract_address}\n")

    print("Contract address updated. Please restart the application if necessary.")

if __name__ == "__main__":
    main()