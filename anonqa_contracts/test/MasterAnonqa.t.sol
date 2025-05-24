// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Test, console2 } from "forge-std/Test.sol";
import { MasterAnonqa } from "../contracts/MasterAnonqa.sol";
import { IMasterAnonqa } from "../contracts/interfaces/IMasterAnonqa.sol";
import { AnonqaConfig } from "../contracts/AnonqaConfig.sol";
import { IAnonqaConfig } from "../contracts/interfaces/IAnonqaConfig.sol";
import { AnonqaConstants } from "../contracts/utils/AnonqaConstants.sol";

import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract MasterAnonqaTest is Test {
    ProxyAdmin proxyAdmin;
    AnonqaConfig anonqaConfig;
    MasterAnonqa public masterAnonqa;

    address public admin;
    address public user;
    address public bot;

    uint256 public maxQuestionLifeTime;

    function setUp() public virtual {
        admin = makeAddr("admin");
        user = makeAddr("user");
        bot = makeAddr("bot");

        maxQuestionLifeTime = 7 days;

        vm.startPrank(admin);

        proxyAdmin = new ProxyAdmin(admin);

        AnonqaConfig anonqaConfigImpl = new AnonqaConfig();
        TransparentUpgradeableProxy anonqaConfigProxy = 
            new TransparentUpgradeableProxy(address(anonqaConfigImpl), address(proxyAdmin), "");
        anonqaConfig = AnonqaConfig(address(anonqaConfigProxy));
        anonqaConfig.__AnonqaConfig_Init(admin);

        MasterAnonqa masterAnonqaImpl = new MasterAnonqa();
        TransparentUpgradeableProxy masterAnonqaProxy =
            new TransparentUpgradeableProxy(address(masterAnonqaImpl), address(proxyAdmin), "");
        masterAnonqa = MasterAnonqa(address(masterAnonqaProxy));
        masterAnonqa.__MasterQA_Init(address(anonqaConfig), maxQuestionLifeTime);

        anonqaConfig.grantRole(AnonqaConstants.BOT_ROLE, bot);

        vm.stopPrank();
    }
}

contract InitializationTest is MasterAnonqaTest {
    function test_Initialization() public view {
        assertEq(masterAnonqa.totalQuestions(), 0);
        assertEq(masterAnonqa.maxQuestionLifeTime(), 7 days);
        assertTrue(anonqaConfig.hasRole(AnonqaConstants.BOT_ROLE, bot));
        assertTrue(anonqaConfig.hasRole(AnonqaConstants.DEFAULT_ADMIN_ROLE, admin));
        assertEq(address(masterAnonqa.anonqaConfig()), address(anonqaConfig));
    }
}

contract PostQuestionTest is MasterAnonqaTest {
    event QuestionBorned(bytes32 _questionId, string _questionTitle, string _question, uint256 _endTime);

    function test_RevertEmptyQuestion() public {
        uint256 endTime = block.timestamp + 1 days;

        vm.startPrank(user);
        vm.expectRevert(IMasterAnonqa.EmptyQuestion.selector);
        masterAnonqa.postQuestion("test question", "", endTime);
        vm.stopPrank();
    }

    function test_RevertEmptyQuestionTitle() public {
        uint256 endTime = block.timestamp + 1 days;

        vm.startPrank(user);
        vm.expectRevert(IMasterAnonqa.EmptyQuestionTitle.selector);
        masterAnonqa.postQuestion("", "question title", endTime);
        vm.stopPrank();
    }

    function test_RevertPostDuplicateQuestion() public {
        uint256 endTime = block.timestamp + 1 days;

        vm.startPrank(user);
        masterAnonqa.postQuestion("question title", "test question", endTime);
        vm.expectRevert(IMasterAnonqa.QuestionAlreadyBorned.selector);
        masterAnonqa.postQuestion("question title", "test question", endTime);
        vm.stopPrank();
    }

    function test_RevertQuestionLifeTimeTooLong() public {
        uint256 endTime = block.timestamp + 8 days;

        vm.startPrank(user);
        vm.expectRevert(IMasterAnonqa.QuestionLifeTimeTooMuch.selector);
        masterAnonqa.postQuestion("question title", "test question", endTime);
        vm.stopPrank();
    }

    function test_EmitQuestionPosted() public {
        bytes32 questionId = keccak256(abi.encodePacked("question title", "Testing..."));
        uint256 endTime = block.timestamp + 1 days;

        vm.prank(user);
        vm.expectEmit(true, true, true, true);
        emit QuestionBorned(questionId, "question title", "Testing...", endTime);
        masterAnonqa.postQuestion("question title", "Testing...", endTime);

        IMasterAnonqa.QuestionInfo memory questionInfo = masterAnonqa.getQuestionInfo(questionId);
        assertEq(questionInfo.questionId, questionId);
        assertEq(questionInfo.question, "Testing...");
        assertEq(questionInfo.endTime, endTime);
        assertEq(masterAnonqa.totalQuestions(), 1);
    }


    function test_PostLargeQuestion() public {
        bytes32 questionId = keccak256(
            abi.encodePacked(
                "question title",
                "Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol"
            )
        );
        uint256 endTime = block.timestamp + 1 days;

        vm.prank(user);
        masterAnonqa.postQuestion(
            "question title",
            "Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol",
            endTime
        );

        IMasterAnonqa.QuestionInfo memory questionInfo = masterAnonqa.getQuestionInfo(questionId);
        assertEq(questionInfo.questionId, questionId);
        assertEq(
            questionInfo.question,
            "Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. Hello dear, hope you are doing good. anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol anonqa_contracts/test/MasterQA.t.sol"
        );
        assertEq(questionInfo.endTime, endTime);
        assertEq(masterAnonqa.totalQuestions(), 1);
    }
}

contract PostAnswerTest is MasterAnonqaTest {
    bytes32 questionId;

    event AnswerPosted(bytes32 _questionId, bytes32 _answerId, string _answer);

    function setUp() public override {
        super.setUp();

        questionId = keccak256(abi.encodePacked("question title", "Testing..."));

        vm.prank(user);
        masterAnonqa.postQuestion("question title", "Testing...", block.timestamp + 6 days);
    }

    function test_RevertQuestionIsNotBorn() public {
        vm.expectRevert(IMasterAnonqa.QuestionNotBorned.selector);
        masterAnonqa.postAnswer(bytes32("1"), "Testing...");
    }

    function test_RevertQuestionIsDead() public {
        vm.warp(block.timestamp + 7 days);

        vm.expectRevert(IMasterAnonqa.QuestionIsDead.selector);
        masterAnonqa.postAnswer(questionId, "Testing...");
    }

    function test_RevertAnswerAlreadyGiven() public {
        masterAnonqa.postAnswer(questionId, "Testing...");

        vm.expectRevert(IMasterAnonqa.AnswerAlreadyGiven.selector);
        masterAnonqa.postAnswer(questionId, "Testing...");
    }

    function test_EmitPostAnswer() public {
        bytes32 answerId = keccak256(abi.encodePacked("Testing..."));
        vm.expectEmit(true, true, true, true);
        emit AnswerPosted(questionId, answerId, "Testing...");
        masterAnonqa.postAnswer(questionId, "Testing...");

        IMasterAnonqa.AnswerInfo[] memory answers = masterAnonqa.getAnswerInfo(questionId);
        assertEq(answers.length, 1);
        assertEq(answers[0].questionId, questionId);
        assertEq(answers[0].answerId, answerId);
        assertEq(answers[0].answer, "Testing...");
    }
}

contract FuneralTest is MasterAnonqaTest {
    bytes32 questionId1;
    bytes32 questionId2;

    event FuneralCompleted(bytes32 _questionId);

    function setUp() public override {
        super.setUp();

        questionId1 = keccak256(abi.encodePacked("question title", "Testing... 1"));
        questionId2 = keccak256(abi.encodePacked("question title", "Testing... 2"));

        vm.startPrank(user);
        masterAnonqa.postQuestion("question title", "Testing... 1", block.timestamp + 4 days);
        masterAnonqa.postQuestion("question title", "Testing... 2", block.timestamp + 6 days);
        vm.stopPrank();
    }

    function test_RevertNotBot() public {
        bytes32[] memory questionIds = new bytes32[](2);
        questionIds[0] = questionId1;
        questionIds[1] = bytes32("2");

        vm.warp(block.timestamp + 5 days);

        vm.expectRevert(IAnonqaConfig.NotBot.selector);
        masterAnonqa.funeral(questionIds);
    }

    function test_RevertInvalidQuestion() public {
        bytes32[] memory questionIds = new bytes32[](2);
        questionIds[0] = questionId1;
        questionIds[1] = bytes32("2");

        vm.warp(block.timestamp + 5 days);

        vm.prank(bot);
        vm.expectRevert(IMasterAnonqa.InvalidQuestion.selector);
        masterAnonqa.funeral(questionIds);
    }

    function test_RevertQuestionSentToHeaven() public {
        bytes32[] memory questionIds = new bytes32[](1);
        questionIds[0] = questionId1;

        vm.warp(block.timestamp + 5 days);
        vm.prank(bot);
        masterAnonqa.funeral(questionIds);

        vm.prank(bot);
        vm.expectRevert(IMasterAnonqa.QuestionSentToHeaven.selector);
        masterAnonqa.funeral(questionIds);
    }

    function test_RevertQuestionIsAlive() public {
        bytes32[] memory questionIds = new bytes32[](1);
        questionIds[0] = questionId1;

        vm.prank(bot);
        vm.expectRevert(IMasterAnonqa.QuestionIsAlive.selector);
        masterAnonqa.funeral(questionIds);
    }

    function test_EmitFuneralCompleted() public {
        bytes32[] memory questionIds = new bytes32[](2);
        questionIds[0] = questionId1;
        questionIds[1] = questionId2;

        vm.warp(block.timestamp + 7 days);

        vm.prank(bot);
        vm.expectEmit(true, true, true, true);
        emit FuneralCompleted(questionId1);
        emit FuneralCompleted(questionId2);
        masterAnonqa.funeral(questionIds);

        IMasterAnonqa.QuestionInfo memory questionInfo1 = masterAnonqa.getQuestionInfo(questionId1);
        assertTrue(questionInfo1.sentToHeaven);
        IMasterAnonqa.QuestionInfo memory questionInfo2 = masterAnonqa.getQuestionInfo(questionId2);
        assertTrue(questionInfo2.sentToHeaven);
    }
}

contract AdminFunctionTest is MasterAnonqaTest {
    event MaxQuestionLifeTimeUpdated(uint256 _maxQuestionLifeTime);

    function test_PauseUnpause() public {
        vm.startPrank(admin);
        masterAnonqa.pause();
        assertTrue(masterAnonqa.paused());

        masterAnonqa.unpause();
        assertFalse(masterAnonqa.paused());
        vm.stopPrank();
    }

    function test_RevertNonOwnerPause() public {
        vm.startPrank(user);
        vm.expectRevert();
        masterAnonqa.pause();
        vm.stopPrank();
    }

    function test_RevertNotAdmin() public {
        vm.expectRevert(IAnonqaConfig.NotAdmin.selector);
        masterAnonqa.setMaxQuestionLifeTime(2 days);
    }

    function test_EmitMaxQuestionLifeTimeUpdated() public {
        vm.prank(admin);
        vm.expectEmit(true, true, true, true);
        emit MaxQuestionLifeTimeUpdated(2 days);
        masterAnonqa.setMaxQuestionLifeTime(2 days);

        assertEq(masterAnonqa.maxQuestionLifeTime(), 2 days);
    }
}
