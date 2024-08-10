# from web3 import Web3
# from eth_utils import is_address
# from django.conf import settings
# import logging

# logger = logging.getLogger(__name__)

# w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))

# def get_contract():
#     contract_address = settings.CONTRACT_ADDRESS
#     logger.info(f"Contract address: {contract_address}")
#     logger.info(f"ABI: {settings.CONTRACT_ABI}")
    
#     if not is_address(contract_address):  # 수정된 부분
#         logger.error(f"Invalid contract address: {contract_address}")
#         return None
    
#     contract = w3.eth.contract(address=contract_address, abi=settings.CONTRACT_ABI)
#     logger.info(f"Contract functions: {contract.all_functions()}")
#     return contract

# def record_score(player_name, score):
#     contract = get_contract()
#     if not contract:
#         logger.error("Failed to get contract instance")
#         return
    
#     try:
#         logger.info(f"Attempting to record score for {player_name}: {score}")
#         tx = contract.functions.recordScore(player_name, score).build_transaction({
#             'from': settings.ACCOUNT_ADDRESS,
#             'gas': 2000000,
#             'gasPrice': w3.eth.gas_price,
#             'nonce': w3.eth.get_transaction_count(settings.ACCOUNT_ADDRESS),
#         })
#         logger.info(f"Built transaction: {tx}")
        
#         signed_tx = w3.eth.account.sign_transaction(tx, private_key=settings.PRIVATE_KEY)
#         tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
#         receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
#         logger.info(f"Score recorded for {player_name}: {score}. Transaction hash: {receipt.transactionHash.hex()}")
#     except Exception as e:
#         logger.error(f"Error recording score: {str(e)}", exc_info=True)

# def get_scores(player_name):
#     contract = get_contract()
#     if not contract:
#         logger.error("Failed to get contract instance")
#         return [], []
    
#     try:
#         logger.info(f"Attempting to get scores for {player_name}")
#         scores, timestamps = contract.functions.getScores(player_name).call()
#         logger.info(f"Scores retrieved for {player_name}: {scores}")
#         return scores, timestamps
#     except Exception as e:
#         logger.error(f"Error in get_scores for {player_name}: {str(e)}", exc_info=True)
#         return [], []

# from web3 import Web3
# from django.conf import settings
# import logging

# logger = logging.getLogger(__name__)

# w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))

# def get_contract():
#     # 체크섬 주소로 변환
#     checksum_address = w3.to_checksum_address(settings.CONTRACT_ADDRESS)
#     return w3.eth.contract(address=checksum_address, abi=settings.CONTRACT_ABI)

# def record_score(player_name, score):
#     contract = get_contract()
#     # 체크섬 주소로 변환
#     checksum_address = w3.to_checksum_address(settings.ACCOUNT_ADDRESS)
#     try:
#         tx_hash = contract.functions.recordScore(player_name, score).transact({
#             'from': checksum_address,
#             'gas': 2000000  # 가스 한도 추가
#         })
#         receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
#         logger.info(f"Score recorded for {player_name}: {score}. Transaction hash: {receipt.transactionHash.hex()}")
#     except Exception as e:
#         logger.error(f"Error recording score: {str(e)}", exc_info=True)

# def get_scores(player_name):
#     contract = get_contract()
#     try:
#         logger.info(f"Attempting to get scores for player: {player_name}")
#         logger.info(f"Contract address: {contract.address}")
#         logger.info(f"Connected to network: {w3.is_connected()}")
#         scores, timestamps = contract.functions.getScores(player_name).call()
#         logger.info(f"Raw scores: {scores}, timestamps: {timestamps}")
#         return scores, timestamps
#     except Exception as e:
#         logger.error(f"Error in get_scores: {str(e)}", exc_info=True)
#         return [], []

from web3 import Web3
from eth_utils import to_checksum_address
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))

def get_contract():
    # 체크섬 주소로 변환
    checksum_address = to_checksum_address(settings.CONTRACT_ADDRESS)
    return w3.eth.contract(address=checksum_address, abi=settings.CONTRACT_ABI)

def record_score(player_name, score):
    contract = get_contract()
    # 체크섬 주소로 변환
    checksum_address = to_checksum_address(settings.ACCOUNT_ADDRESS)
    try:
        tx_hash = contract.functions.recordScore(player_name, score).transact({
            'from': checksum_address,
            'gas': 2000000  # 가스 한도 추가
        })
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"Score recorded for {player_name}: {score}. Transaction hash: {receipt.transactionHash.hex()}")
    except Exception as e:
        logger.error(f"Error recording score: {str(e)}", exc_info=True)

def get_scores(player_name):
    contract = get_contract()
    try:
        logger.info(f"Attempting to get scores for player: {player_name}")
        logger.info(f"Contract address: {contract.address}")
        logger.info(f"Connected to network: {w3.is_connected()}")
        scores, timestamps = contract.functions.getScores(player_name).call()
        logger.info(f"Raw scores: {scores}, timestamps: {timestamps}")
        return scores, timestamps
    except Exception as e:
        logger.error(f"Error in get_scores: {str(e)}", exc_info=True)
        return [], []