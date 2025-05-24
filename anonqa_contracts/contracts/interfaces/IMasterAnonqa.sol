// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

interface IMasterAnonqa {
    struct QuestionInfo {
        bytes32 questionId;
        string questionTitle;
        string question;
        address owner;
        uint256 endTime;
        bool sentToHeaven;
    }

    struct AnswerInfo {
        bytes32 questionId;
        bytes32 answerId;
        string answer;
        address owner;
    }

    error QuestionAlreadyBorned();
    error InvalidQuestion();
    error QuestionNotBorned();
    error QuestionIsDead();
    error AnswerAlreadyGiven();
    error QuestionLifeTimeTooMuch();
    error QuestionSentToHeaven();
    error QuestionIsAlive();
    error EmptyQuestion();
    error EmptyQuestionTitle();


    event FuneralCompleted(bytes32 _questionId);
    event QuestionBorned(bytes32 _questionId, string _questionTitle, string _question, address _owner, uint256 _endTime);
    event AnswerPosted(bytes32 _questionId, bytes32 _answerId, string _answer, address _owner);
    event MaxQuestionLifeTimeUpdated(uint256 _maxQuestionLifeTime);
}
