
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;
import { Script, console2 } from "forge-std/Script.sol";

import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import { MasterAnonqa } from "../contracts/MasterAnonqa.sol";
import { IMasterAnonqa } from "../contracts/interfaces/IMasterAnonqa.sol";
import { AnonqaConfig } from "../contracts/AnonqaConfig.sol";
import { IAnonqaConfig } from "../contracts/interfaces/IAnonqaConfig.sol";
import { AnonqaConstants } from "../contracts/utils/AnonqaConstants.sol";

contract DeployAnonqa is Script {
    ProxyAdmin proxyAdmin;
    AnonqaConfig anonqaConfig;
    MasterAnonqa public masterAnonqa;

    function run() public {
        vm.startBroadcast();

        // proxyAdmin = new ProxyAdmin(0xEBA436aE4012D8194a5b44718a8ba6ec553241bE);

        // AnonqaConfig anonqaConfigImpl = new AnonqaConfig();
        // TransparentUpgradeableProxy anonqaConfigProxy = 
        //     new TransparentUpgradeableProxy(address(anonqaConfigImpl), address(proxyAdmin), "");
        // anonqaConfig = AnonqaConfig(address(anonqaConfigProxy));
        // anonqaConfig.__AnonqaConfig_Init(0xEBA436aE4012D8194a5b44718a8ba6ec553241bE);

        // MasterAnonqa masterAnonqaImpl = new MasterAnonqa();
        // TransparentUpgradeableProxy masterAnonqaProxy =
        //     new TransparentUpgradeableProxy(address(masterAnonqaImpl), address(proxyAdmin), "");
        // masterAnonqa = MasterAnonqa(address(masterAnonqaProxy));
        // masterAnonqa.__MasterQA_Init(address(anonqaConfig), 7 days);

        // anonqaConfig.grantRole(AnonqaConstants.BOT_ROLE, 0xEBA436aE4012D8194a5b44718a8ba6ec553241bE);

        // console2.log("proxyAdmin deployed at: ", address(proxyAdmin));
        
        // console2.log("anonqaConfig Impl deployed at: ", address(anonqaConfigImpl));
        // console2.log("anonqaConfig proxy deployed at: ", address(anonqaConfigProxy));

        // console2.log("masterAnonqa Impl deployed at: ", address(masterAnonqaImpl));
        // console2.log("masterAnonqa proxy deployed at: ", address(masterAnonqaProxy));

        // console2.log("Admin role: ", anonqaConfig.hasRole(AnonqaConstants.DEFAULT_ADMIN_ROLE, 0xEBA436aE4012D8194a5b44718a8ba6ec553241bE));
        // console2.log("Bot role: ", anonqaConfig.hasRole(AnonqaConstants.BOT_ROLE, 0xEBA436aE4012D8194a5b44718a8ba6ec553241bE));

        // bytes32 questionId1 = masterAnonqa.postQuestion("Q1", "Testing... 0", block.timestamp + 6 days);
        // bytes32 questionId2 = masterAnonqa.postQuestion("Q2", "Testing... 1", block.timestamp + 6 days);

        // console2.logBytes32(questionId1);
        // console2.logBytes32(questionId2);

        // console2.logBytes32(masterAnonqa.postAnswer(questionId1, "testing."));
        // console2.logBytes32(masterAnonqa.postAnswer(questionId1, "testing.."));
        
        // console2.logBytes32(masterAnonqa.postAnswer(questionId2, "testing...."));
        // console2.logBytes32(masterAnonqa.postAnswer(questionId2, "testing..."));

        // 0xfa8f3168ed2b7e1dac72b0f5df90a57c1aefe2cc65783a384801e5b155fe4c9a
        // 0x2e2ec360171b4183a78491ce935180ef416791586849baf2a76214093679a9e6

        masterAnonqa = MasterAnonqa(0x8901298c6a163Db4B479E9cEEa1b65a49f2c6EF7);

        bytes32[] memory questionIds = new bytes32[](2);
        questionIds[0] = 0xfa8f3168ed2b7e1dac72b0f5df90a57c1aefe2cc65783a384801e5b155fe4c9a;
        questionIds[1] = 0x2e2ec360171b4183a78491ce935180ef416791586849baf2a76214093679a9e6;
        masterAnonqa.funeral(questionIds);

        vm.stopBroadcast();
    }
}