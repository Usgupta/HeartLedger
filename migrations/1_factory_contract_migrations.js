const FundraiserFactoryContract = artifacts.require("FundraiserFactory");
// const CampaignManagementContract = artifacts.require('CampaignManagement');
// const AllocationContract = artifacts.require("AllocationFactory");
const LogInContract = artifacts.require("UserAccessControl");

module.exports = function (deployer) {
  // deployer.deploy(AllocationContract);
  deployer.deploy(FundraiserFactoryContract);
  deployer.deploy(LogInContract);
};
