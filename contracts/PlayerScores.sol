// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PlayerScores {
    struct Score {
        uint256 score;
        uint256 timestamp;
    }
    
    mapping(string => Score[]) private playerScores;

    event ScoreRecorded(string indexed playerName, uint256 score, uint256 timestamp);

    function recordScore(string memory playerName, uint256 score) public {
        require(bytes(playerName).length > 0, "Player name cannot be empty");
        playerScores[playerName].push(Score(score, block.timestamp));
        emit ScoreRecorded(playerName, score, block.timestamp);
    }

    function getScores(string memory playerName) public view returns (uint256[] memory, uint256[] memory) {
        require(bytes(playerName).length > 0, "Player name cannot be empty");
        Score[] storage scores = playerScores[playerName];
        uint256[] memory scoreValues = new uint256[](scores.length);
        uint256[] memory timestamps = new uint256[](scores.length);
        
        for (uint i = 0; i < scores.length; i++) {
            scoreValues[i] = scores[i].score;
            timestamps[i] = scores[i].timestamp;
        }
        
        return (scoreValues, timestamps);
    }

    function getPlayerScoreCount(string memory playerName) public view returns (uint256) {
        return playerScores[playerName].length;
    }
}