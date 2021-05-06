pragma solidity 0.7.6;

import "./_external/SafeMath.sol";
import "./_external/Ownable.sol";

interface IOracle {
    function getData() external returns (uint256, bool);
}

/**
 * @title Oracle
 *
 * @notice Provides a value onchain that's aggregated from a whitelisted set of
 *         providers.
 */
contract Oracle is Ownable, IOracle {
    using SafeMath for uint256;

    struct Report {
        uint256 timestamp;
        uint256 payload;
    }

    // All past reports
    Report[] public reports;

    // Minimum reports for avg
    uint256 minimumReports;

    event ProviderReportPushed(uint256 payload, uint256 timestamp);

    constructor(uint256 minimumReports_) public {
        Ownable.initialize(msg.sender);
        minimumReports = minimumReports_;
    }

    /**
     * @notice Pushes a report for the calling provider.
     * @param payload is expected to be 18 decimal fixed point number.
     */
    function pushReport(uint256 payload) external onlyOwner {
        Report memory report = Report(block.timestamp, payload);
        reports.push(report);
        emit ProviderReportPushed(payload, block.timestamp);
    }

    /**
     * @notice Computes time weighted average price over last period.
     * @return AggregatedValue: Average price.
     *         valid: Boolean indicating an aggregated value was computed successfully.
     */
    function getData() external view override returns (uint256, bool) {
        if (reports.length < minimumReports) {
            return (0, false);
        }

        uint sum;
        for (uint8 i = 1; i <= minimumReports; i++) {
            sum = sum.add(reports[reports.length - i].payload);
        }

        return (sum.div(minimumReports), true);
    }
}
