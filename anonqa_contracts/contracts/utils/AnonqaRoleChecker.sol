// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";

import { UtilLib } from "./UtilLib.sol";
import { IAnonqaConfig } from "../interfaces/IAnonqaConfig.sol";
import { AnonqaConstants } from "./AnonqaConstants.sol";

abstract contract AnonqaRoleChecker is Initializable {

    event AnonqaConfigUpdated(address indexed _anonqaConfig);

    IAnonqaConfig public anonqaConfig;

    modifier onlyAdmin() {
        if (!IAccessControl(address(anonqaConfig)).hasRole(AnonqaConstants.DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert IAnonqaConfig.NotAdmin();
        }
        _;
    }

    modifier onlyBot() {
        if (!IAccessControl(address(anonqaConfig)).hasRole(AnonqaConstants.BOT_ROLE, msg.sender)) {
            revert IAnonqaConfig.NotBot();
        }
        _;
    }

    function updateAnonqaConfig(address _anonqaConfig) external onlyAdmin {
        UtilLib.checkNonZeroAddress(_anonqaConfig);

        anonqaConfig = IAnonqaConfig(_anonqaConfig);
        emit AnonqaConfigUpdated(_anonqaConfig);
    }
}
