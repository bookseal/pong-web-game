from web3 import Web3
from django.conf import settings
import json

def get_contract():
    with open('contract_address.txt', 'r') as f:
        contract_address = f.read().strip()
    
    with open('contract_abi.json', 'r') as f:
        contract_abi = json.load(f)
    
    w3 = Web3(Web3.HTTPProvider("http://ganache:8545"))
    return w3.eth.contract(address=contract_address, abi=contract_abi)

def record_score(player_name, score):
    contract = get_contract()
    w3 = contract.web3
    account = w3.eth.accounts[0]
    tx_hash = contract.functions.recordScore(player_name, score).transact({
        'from': account,
        'gas': 2000000
    })
    w3.eth.wait_for_transaction_receipt(tx_hash)

def get_scores(player_name):
    contract = get_contract()
    try:
        print(f"Attempting to get scores for player: {player_name}")
        scores, timestamps = contract.functions.getScores(player_name).call()
        print(f"Raw scores: {scores}, timestamps: {timestamps}")
        return scores, timestamps
    except Exception as e:
        print(f"Error in get_scores: {str(e)}")
        return [], []