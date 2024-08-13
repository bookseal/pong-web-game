import json
from web3 import Web3
import time

def main():
    print("Starting contract deployment process...")

    with open('contract_abi.json', 'r') as abi_file:
        abi = json.load(abi_file)
    
    with open('contract_bytecode.txt', 'r') as bytecode_file:
        bytecode = bytecode_file.read().strip()

    print(f"ABI loaded: {json.dumps(abi, indent=2)}")
    print(f"Bytecode loaded: {bytecode[:100]}...")  # 처음 100자만 출력

    w3 = Web3(Web3.HTTPProvider("http://ganache:8545"))

    max_attempts = 30
    attempts = 0
    while not w3.isConnected() and attempts < max_attempts:
        print(f"Waiting for Ganache connection... Attempt {attempts + 1}/{max_attempts}")
        time.sleep(2)
        attempts += 1

    if not w3.isConnected():
        print("Failed to connect to Ganache after multiple attempts. Exiting.")
        return

    print("Connected to Ganache successfully.")

    sender_address = w3.eth.accounts[0]
    print(f"Sender address: {sender_address}")
    
    PlayerScores = w3.eth.contract(abi=abi, bytecode=bytecode)

    nonce = w3.eth.get_transaction_count(sender_address)
    print(f"Nonce: {nonce}")
    
    try:
        gas_estimate = PlayerScores.constructor().estimateGas({'from': sender_address})
        print(f"Estimated gas: {gas_estimate}")
    except Exception as e:
        print(f"Error estimating gas: {str(e)}")
        return
    
    transaction = PlayerScores.constructor().buildTransaction({
        "chainId": 1337,
        "gasPrice": w3.eth.gas_price,
        "from": sender_address,
        "nonce": nonce,
        "gas": int(gas_estimate * 1.2)
    })

    print(f"Transaction: {transaction}")

    try:
        tx_hash = w3.eth.send_transaction(transaction)
        print(f"Transaction hash: {tx_hash.hex()}")
    except Exception as e:
        print(f"Error sending transaction: {str(e)}")
        return

    try:
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction receipt: {tx_receipt}")
    except Exception as e:
        print(f"Error getting transaction receipt: {str(e)}")
        return

    contract_address = tx_receipt.contractAddress

    print(f"Contract deployed at address: {contract_address}")

    with open('contract_address.txt', 'w') as f:
        f.write(contract_address)

    print("Contract deployment completed successfully.")

    # Verify contract deployment
    deployed_contract = w3.eth.contract(address=contract_address, abi=abi)
    try:
        result = deployed_contract.functions.getPlayerScoreCount("test").call()
        print(f"Test call to getPlayerScoreCount: {result}")
    except Exception as e:
        print(f"Error calling getPlayerScoreCount: {str(e)}")

if __name__ == "__main__":
    main()