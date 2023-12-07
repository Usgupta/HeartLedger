// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Fundraiser.sol";

contract FundraiserFactory {
    uint256 constant maxLimit = 50;
    Fundraiser[] public _fundraisers;

    event FundraiserCreated(
        Fundraiser indexed fundraiser,
        address indexed owner
    );

    // Correcting createFundraiser function to match the Fundraiser constructor argument count
    function createFundraiser(
        string memory name,
        string memory image,
        string memory description,
        uint256 goalAmount
    ) public {
        Fundraiser fundraiser = new Fundraiser(
            name,
            image,
            description,
            goalAmount,
            msg.sender // Passing msg.sender as the custodian
        );
        _fundraisers.push(fundraiser);
        emit FundraiserCreated(fundraiser, msg.sender);
    }

    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    // Function to return a list of fundraisers with pagination
    function fundraisers(
        uint256 limit,
        uint256 offset
    ) public view returns (Fundraiser[] memory coll) {
        require(offset <= fundraisersCount(), "offset out of bounds");

        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;
        coll = new Fundraiser[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[offset + i];
        }

        return coll;
    }
}
