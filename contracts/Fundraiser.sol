// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Fundraiser is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Donation {
        uint256 value;
        uint256 date;
        address donor;
        string fundName;
        address ngoAddress;
    }

    struct FundsRequest {
        uint256 amount;
        address payable beneficiary;
        address ngoAddress;
        RequestStatus status;
    }

    enum RequestStatus {
        Pending,
        Approved,
        Rejected
    }

    mapping(address => Donation[]) public _userDonations;
    FundsRequest[] public _requests;
    event DonationReceived(
        address indexed donor,
        uint256 value,
        uint256 indexed date,
        string fundName,
        address indexed ngoAddress
    );
    event RequestCreated(
        address indexed beneficiary,
        uint256 value,
        address indexed ngoAddress,
        string fundName,
        uint256 indexed date
    );
    event RequestApproved(
        address indexed beneficiary,
        uint256 value,
        address indexed ngoAddress,
        string fundName,
        uint256 indexed date
    );
    event RequestRejected(
        address indexed beneficiary,
        uint256 value,
        address indexed ngoAddress,
        string fundName,
        uint256 indexed date
    );

    string public fundName;
    string public image;
    string public description;
    uint256 public goalAmount;
    uint256 public totalDonations;
    address public ngoAddress;
    uint256 public donationsCount;

    constructor(
        string memory _name,
        string memory _image,
        string memory _description,
        uint256 _goalAmount,
        address _custodian // This is the address of the user who created the fund
    ) {
        fundName = _name;
        image = _image;
        description = _description;
        ngoAddress = _custodian;
        goalAmount = _goalAmount;
        _transferOwnership(_custodian); //  This is the address of the user who created the fund
    }

    function myDonationsCount() public view returns (uint256) {
        return _userDonations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp,
            donor: msg.sender,
            fundName: fundName,
            ngoAddress: ngoAddress
        });
        _userDonations[msg.sender].push(donation);
        donationsCount++;
        totalDonations = totalDonations.add(msg.value);
        emit DonationReceived(
            msg.sender,
            msg.value,
            block.timestamp,
            fundName,
            ngoAddress
        );
    }

    function allRequests()
        external
        view
        returns (
            uint256[] memory requestID,
            uint256[] memory amounts,
            address[] memory beneficiaries,
            address[] memory ngoAddresses,
            RequestStatus[] memory statuses
        )
    {
        uint256 count = _requests.length;
        requestID = new uint256[](count); // Initialize the requestID array
        amounts = new uint256[](count);
        beneficiaries = new address[](count);
        ngoAddresses = new address[](count);
        statuses = new RequestStatus[](count);

        for (uint256 i = 0; i < count; i++) {
            FundsRequest storage request = _requests[i];
            requestID[i] = i; // Set the request ID
            amounts[i] = request.amount;
            beneficiaries[i] = request.beneficiary;
            ngoAddresses[i] = request.ngoAddress;
            statuses[i] = request.status;
        }
    }

    function myDonations()
        public
        view
        returns (
            uint256[] memory values,
            uint256[] memory dates,
            string[] memory fundNames,
            address[] memory ngoAddresses
        )
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);
        fundNames = new string[](count);
        ngoAddresses = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _userDonations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
            fundNames[i] = donation.fundName;
            ngoAddresses[i] = donation.ngoAddress;
        }
    }

    function createRequest(
        address payable _beneficiary,
        uint256 _requestAmount
    ) public {
        require(
            totalDonations >= _requestAmount,
            "Insufficient funds for request"
        );

        _requests.push(
            FundsRequest({
                amount: _requestAmount,
                beneficiary: _beneficiary,
                ngoAddress: ngoAddress,
                status: RequestStatus.Pending
            })
        );
        emit RequestCreated(
            _beneficiary,
            _requestAmount,
            ngoAddress,
            fundName,
            block.timestamp
        );
    }

    function approveRequest(uint256 requestId) public onlyOwner nonReentrant {
        require(requestId < _requests.length, "Invalid request ID");
        FundsRequest storage request = _requests[requestId];
        require(
            request.status == RequestStatus.Pending,
            "Request is not pending"
        );
        require(
            address(this).balance >= request.amount,
            "Insufficient contract balance"
        );
        totalDonations = totalDonations.sub(request.amount);
        request.status = RequestStatus.Approved;
        request.beneficiary.transfer(request.amount);

        emit RequestApproved(
            request.beneficiary,
            request.amount,
            request.ngoAddress,
            fundName,
            block.timestamp
        );
    }

    function rejectRequest(uint256 requestId) public onlyOwner {
        require(requestId < _requests.length, "Invalid request ID");
        FundsRequest storage request = _requests[requestId];
        require(
            request.status == RequestStatus.Pending,
            "Request is not pending"
        );

        request.status = RequestStatus.Rejected;

        emit RequestRejected(
            request.beneficiary,
            request.amount,
            request.ngoAddress,
            fundName,
            block.timestamp
        );
    }
}
