// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { AnonqaConstants } from "./utils/AnonqaConstants.sol";
import { IAnonqaConfig } from "./interfaces/IAnonqaConfig.sol";
import { UtilLib } from "./utils/UtilLib.sol";

contract AnonqaConfig is Initializable, AccessControlUpgradeable, IAnonqaConfig {
    mapping(bytes32 => address) public addressMap;

    constructor() {
        _disableInitializers();
    }

    function __AnonqaConfig_Init(address _admin) public initializer {
        UtilLib.checkNonZeroAddress(_admin);

        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function getAddress(bytes32 _key) external view returns (address) {
        return addressMap[_key];
    }

    function setAddress(bytes32 _key, address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_key == bytes32(0)) {
            revert InvalidKey();
        }

        addressMap[_key] = _address;

        emit AddressSet(_key, _address);
    }
}
