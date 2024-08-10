from web3 import Web3
import json
import os
import time

# Web3 설정
w3 = Web3(Web3.HTTPProvider('http://ganache:8545'))

# 컨트랙트 ABI와 바이트코드 로드
with open('contract_abi.json', 'r') as file:
    contract_abi = json.load(file)

with open('contract_bytecode.txt', 'r') as file:
    contract_bytecode = file.read().strip()

# Ganache가 완전히 시작될 때까지 대기
max_attempts = 30
for attempt in range(max_attempts):
    try:
        if w3.isConnected() and len(w3.eth.accounts) > 0:
            break
    except Exception:
        pass
    time.sleep(1)
else:
    raise Exception("Ganache 연결 실패")

# 이미 배포된 컨트랙트가 있는지 확인
env_path = '.env'
if os.path.exists(env_path):
    with open(env_path, 'r') as file:
        for line in file:
            if line.startswith('CONTRACT_ADDRESS='):
                existing_contract = line.split('=')[1].strip()
                if existing_contract:
                    print(f"Existing contract found: {existing_contract}")
                    print(f"Skipping deployment")
                    exit(0)

# 계정 잔액 확인
account = w3.eth.accounts[0]
balance = w3.eth.get_balance(account)
print(f"Account {account} balance: {Web3.fromWei(balance, 'ether')} ETH")

# 컨트랙트 배포
contract = w3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)

# 가스 추정
gas_estimate = contract.constructor().estimateGas()
gas_limit = int(gas_estimate * 1.2)  # 20% 여유 추가
print(f"Estimated gas: {gas_estimate}")

# 트랜잭션 전송
tx_hash = contract.constructor().transact({
    'from': account,
    'gas': gas_estimate,
    'gasPrice': w3.eth.gas_price
})

# 트랜잭션 영수증 대기
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

contract_address = tx_receipt.contractAddress

# .env 파일 업데이트
with open(env_path, 'r') as file:
    lines = file.readlines()

with open(env_path, 'w') as file:
    for line in lines:
        if line.startswith('CONTRACT_ADDRESS='):
            file.write(f'CONTRACT_ADDRESS={contract_address}\n')
        elif line.startswith('ACCOUNT_ADDRESS='):
            file.write(f'ACCOUNT_ADDRESS={account}\n')
        else:
            file.write(line)

print(f"Contract deployed at: {contract_address}")
print(f"Account address: {account}")
print("Updated .env file with new contract and account addresses.")