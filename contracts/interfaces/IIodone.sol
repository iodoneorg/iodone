// pragma solidity ^0.4.24;

// Public interface definition for the Iodone supply policy
interface IIodone {
    function epoch() external view returns (uint256);

    function lastRebaseTimestampSec() external view returns (uint256);

    function inRebaseWindow() external view returns (bool);

    function globalIodoneEpochAndIODNSupply() external view returns (uint256, uint256);
}
