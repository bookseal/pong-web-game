from web3 import Web3
from django.conf import settings

w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))

def get_contract():
    return w3.eth.contract(address=settings.CONTRACT_ADDRESS, abi=settings.CONTRACT_ABI)

def record_score(player_name, score):
    contract = get_contract()
    tx_hash = contract.functions.recordScore(player_name, score).transact({'from': settings.ACCOUNT_ADDRESS})
    w3.eth.wait_for_transaction_receipt(tx_hash)

def get_scores(player_name):
    contract = get_contract()
    return contract.functions.getScores(player_name).call()