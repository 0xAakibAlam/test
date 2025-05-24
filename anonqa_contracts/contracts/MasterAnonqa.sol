// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import { IMasterAnonqa } from "./interfaces/IMasterAnonqa.sol";
import { IAnonqaConfig } from "./AnonqaConfig.sol";
import { AnonqaRoleChecker } from "./utils/AnonqaRoleChecker.sol";

contract MasterAnonqa is
    Initializable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    IMasterAnonqa,
    AnonqaRoleChecker
{
    mapping(bytes32 => QuestionInfo) public questionData;

    mapping(bytes32 => AnswerInfo[]) public answerData;

    bytes32[] public questionIds;

    uint256 public maxQuestionLifeTime;

    constructor() {
        _disableInitializers();
    }

    function __MasterQA_Init(address _anonqaConfig, uint256 _maxQuestionLifeTime) public initializer {
        __Pausable_init();
        __ReentrancyGuard_init();

        anonqaConfig = IAnonqaConfig(_anonqaConfig);
        maxQuestionLifeTime = _maxQuestionLifeTime;
    }

    function totalQuestions() external view returns (uint256) {
        return questionIds.length;
    }

    function getQuestionInfo(bytes32 _questionId) external view returns (QuestionInfo memory) {
        return questionData[_questionId];
    }

    function getAnswerInfo(bytes32 _questionId) external view returns (AnswerInfo[] memory) {
        return answerData[_questionId];
    }

    function postQuestion(
        string calldata _questionTitle,
        string calldata _question,
        uint256 _endTime
    )
        external
        whenNotPaused
        nonReentrant
        returns (bytes32 _questionId)
    {
        // add check that if any of question or questionTitle is empty. then revert.
        if (bytes(_question).length == 0) {
            revert EmptyQuestion();
        }
        if (bytes(_questionTitle).length == 0) {
            revert EmptyQuestionTitle();
        }
        
        _questionId = keccak256(abi.encodePacked(_questionTitle, _question));

        QuestionInfo memory questionInfo = questionData[_questionId];
        if (questionInfo.questionId != bytes32(0)) {
            revert QuestionAlreadyBorned();
        }
        if (block.timestamp + maxQuestionLifeTime < _endTime) {
            revert QuestionLifeTimeTooMuch();
        }

        questionData[_questionId] =
            QuestionInfo({ questionId: _questionId, questionTitle: _questionTitle, question: _question, owner: msg.sender, endTime: _endTime, sentToHeaven: false });

        questionIds.push(_questionId);

        emit QuestionBorned(_questionId, _questionTitle, _question, msg.sender, _endTime);
    }

    function postAnswer(bytes32 _questionId, string calldata _answer) external whenNotPaused nonReentrant returns (bytes32 _answerId) {
        QuestionInfo memory questionInfo = questionData[_questionId];
        if (questionInfo.questionId != _questionId) {
            revert QuestionNotBorned();
        }
        if (questionInfo.sentToHeaven || questionInfo.endTime <= block.timestamp) {
            revert QuestionIsDead();
        }

        AnswerInfo[] memory answerInfo = answerData[_questionId];
        _answerId = keccak256(abi.encodePacked(_answer));
        for (uint256 i; i < answerInfo.length; i++) {
            if (answerInfo[i].answerId == _answerId) {
                revert AnswerAlreadyGiven();
            }
        }

        answerData[_questionId].push(AnswerInfo({ questionId: _questionId, answerId: _answerId, answer: _answer, owner: msg.sender }));

        emit AnswerPosted(_questionId, _answerId, _answer, msg.sender);
    }

    function funeral(bytes32[] calldata _questionIds) external onlyBot {
        for (uint256 i; i < _questionIds.length; i++) {
            _checkQuestionToArchive(_questionIds[i]);

            QuestionInfo storage questionInfo = questionData[_questionIds[i]];
            questionInfo.sentToHeaven = true;

            emit FuneralCompleted(_questionIds[i]);
        }
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    function setMaxQuestionLifeTime(uint256 _maxQuestionLifeTime) external onlyAdmin {
        maxQuestionLifeTime = _maxQuestionLifeTime;

        emit MaxQuestionLifeTimeUpdated(maxQuestionLifeTime);
    }

    function _checkQuestionToArchive(bytes32 _questionId) internal view {
        QuestionInfo memory questionInfo = questionData[_questionId];
        if (questionInfo.questionId != _questionId) {
            revert InvalidQuestion();
        }
        if (questionInfo.sentToHeaven) {
            revert QuestionSentToHeaven();
        }
        if (questionInfo.endTime > block.timestamp) {
            revert QuestionIsAlive();
        }
    }
}
