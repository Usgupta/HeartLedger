const FundraiserContract = artifacts.require('Fundraiser');

contract('Fundraiser', (accounts) => {
  let fundraiser;
  const name = 'Beach cleaning';
  const image =
    'https://images.unsplash.com/photo-1554265352-d7fd5129be15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
  const description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend id enim convallis tempus.';
  const goalAmount = '10';
  const custodian = accounts[0];

  beforeEach(async () => {
    fundraiser = await FundraiserContract.new(
      name,
      image,
      description,
      goalAmount,
      custodian,
    );
  });

  describe('Create Fundraiser and get the parameters Test', () => {
    it('Get Created fundraiser fundName', async () => {
      const actual = await fundraiser.fundName(); 
      assert.equal(actual, name, 'names should match');
    });

    it('Get Created Fundraiser Image', async () => {
      const actual = await fundraiser.image();
      assert.equal(actual, image, 'image should match');
    });

    it('Get Created Fundraiser Description', async () => {
      const actual = await fundraiser.description();
      assert.equal(actual, description, 'description should match');
    });


    it('Get Created Fundraiser GoalAmount', async () => {
      const actual = await fundraiser.goalAmount();
      assert.equal(actual, goalAmount, 'goalAmount should match');
    });

    it('Get Created Fundraiser Owner/Custodian', async () => {

      const actual = await fundraiser.owner();
      console.log('actual not actual',actual,custodian)
    
      assert.equal(actual, custodian, 'custodian should match');
    });
  });


  describe('Create Donation Test', () => {
    const value = web3.utils.toWei('1.5');
    const donor = accounts[2];

    it('My Donation Count Function', async () => {
      const currentDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      });

      await fundraiser.donate({ from: donor, value });
      const newDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      });

      assert.equal(
        1,
        newDonationsCount - currentDonationsCount,
        'myDonationsCount should increment by 1',
      );
     
    });

    it('My Donations View Function', async () => {
      await fundraiser.donate({ from: donor, value });
      const { values, dates } = await fundraiser.myDonations({ from: donor });
      assert.equal(value, values[0], 'values should match');
      assert(dates[0], 'date should be present');
    });

    it('Increase TotalDonations Amount', async () => {
      console.log("cur total donan")
      const currentTotalDonations = await fundraiser.totalDonations();
      await fundraiser.donate({ from: donor, value });
      const newTotalDonations = await fundraiser.totalDonations();
      const diff = newTotalDonations - currentTotalDonations;
      assert.equal(diff.toString(), value.toString(), 'difference should match the donation value');
    });

    it('Increase TotalDonations Count', async () => {
      const currentDonationsCount = await fundraiser.donationsCount();
      await fundraiser.donate({ from: donor, value });
      const newDonationsCount = await fundraiser.donationsCount();

      assert.equal(
        1,
        newDonationsCount - currentDonationsCount,
        'donationsCount should increment by 1',
      );
    });

    it('Emit DonationReceived event', async () => {
      const tx = await fundraiser.donate({ from: donor, value });
      const gasUsed = tx.receipt.gasUsed;
      console.log(`Gas used in donate function: ${gasUsed}`);  
      const expectedEvent = 'DonationReceived';
      const actualEvent = tx.logs[0].event;

      assert.equal(actualEvent, expectedEvent, 'events should match');
      assert.equal(tx.logs[0].args.donor, donor, "Event donor should match");
      assert.equal(tx.logs[0].args.value, value, "Event value should match");
      assert.equal(tx.logs[0].args.fundName, name, "Event fundBameshould match");
      assert.equal(tx.logs[0].args.ngoAddress, custodian, "Event ngoMatch should match");
   
    });
    
  
  });
  describe('Create Request Test', () => {
      const value = web3.utils.toWei('1.5');
      const donor = accounts[0];
      const beneficiary = accounts[2]; 
    
      beforeEach(async () => {
        await fundraiser.donate({ from: donor, value });
      });
      
      it('Emit Request Created Event', async () => {

        const reqAmount = web3.utils.toWei('1.5');
        const txResponse = await fundraiser.createRequest(beneficiary,reqAmount);
        const expectedEvent = 'RequestCreated';
        const actualEvent = txResponse.logs[0].event;

        assert.equal(actualEvent, expectedEvent, 'events should match');    

        // Get the transaction receipt to find the gas used
        const txReceipt = await web3.eth.getTransactionReceipt(txResponse.tx);
        console.log(`Gas used for createRequest function: ${txReceipt.gasUsed}`);  
        assert.equal(actualEvent, expectedEvent, 'events should match');
        assert.equal(txResponse.logs[0].args.beneficiary, beneficiary, "Event donor should match");
        assert.equal(txResponse.logs[0].args.value, value, "Event value should match");
        assert.equal(txResponse.logs[0].args.fundName, name, "Event fundBameshould match");
        assert.equal(txResponse.logs[0].args.ngoAddress, custodian, "Event ngoMatch should match");

    
      });    
     
      it('Approve Request Function', async () => {
    
        const value = web3.utils.toWei('1.5');
        const donor = accounts[2]; 
        const reqAmount = web3.utils.toWei('1.5');
        await fundraiser.donate({ from: donor,value });
        const beneficiary = accounts[1]; // Choose an account as the beneficiary
  
        console.log(beneficiary)
        const txResponse = await fundraiser.createRequest(beneficiary,reqAmount);
        const requestId = 0; // Assuming there's at least one request
        const approveReqResponse = await fundraiser.approveRequest(requestId, { from: custodian });
        const approveReqResponseReceipt = await web3.eth.getTransactionReceipt(approveReqResponse .tx);
        console.log(`Gas used for approveRequest function: ${approveReqResponseReceipt.gasUsed}`);
      
    
      });
      it('Emit RequestApproved Event', async () => {
    
        const reqAmount = web3.utils.toWei('1.5');
        const txResponse = await fundraiser.createRequest(beneficiary,reqAmount);
;
  
        const requestId = 0
        const approveReqResponse = await fundraiser.approveRequest(requestId, { from: custodian });
        const approveReqResponseReceipt = await web3.eth.getTransactionReceipt(approveReqResponse.tx);
        console.log(`Gas used for approveRequest function: ${approveReqResponseReceipt.gasUsed}`);

        const expectedEvent = 'RequestApproved';
        const actualEvent = approveReqResponse.logs[0].event
        assert.equal(actualEvent, expectedEvent, 'events should match');

        assert.equal(approveReqResponse.logs[0].args.beneficiary, beneficiary, "Event donor should match");
        assert.equal(approveReqResponse.logs[0].args.value, value, "Event value should match");
        assert.equal(approveReqResponse.logs[0].args.fundName, name, "Event fundBameshould match");
        assert.equal(approveReqResponse.logs[0].args.ngoAddress, custodian, "Event ngoMatch should match");

    
      });    



      it('Reject Request Function', async () => {
        const reqAmount = web3.utils.toWei('1');
        const txResponse = await fundraiser.createRequest(beneficiary, reqAmount);
        // Get the transaction receipt to find the gas used
        const txReceipt = await web3.eth.getTransactionReceipt(txResponse.tx);
        console.log(`Gas used for createRequest function: ${txReceipt.gasUsed}`);
        const rejectReqResponse = await fundraiser.rejectRequest(0, { from: custodian });
        const rejectReqResponseReceipt = await web3.eth.getTransactionReceipt(rejectReqResponse.tx);
        console.log(`Gas used for rejectRequest function: ${rejectReqResponseReceipt.gasUsed}`);
      })

      it('Emit RequestRejectedEvent Function', async () => {
        const reqAmount = web3.utils.toWei('1');
        const txResponse = await fundraiser.createRequest(beneficiary, reqAmount);
        // Get the transaction receipt to find the gas used
        const txReceipt = await web3.eth.getTransactionReceipt(txResponse.tx);
        const rejectReqResponse = await fundraiser.rejectRequest(0, { from: custodian });
        const expectedEvent = 'RequestRejected';
        const actualEvent = rejectReqResponse.logs[0].event;
        assert.equal(rejectReqResponse.logs[0].args.beneficiary, beneficiary, "Event donor should match");
        assert.equal(rejectReqResponse.logs[0].args.value, reqAmount, "Event value should match");
        assert.equal(rejectReqResponse.logs[0].args.fundName, name, "Event fundBameshould match");
        assert.equal(rejectReqResponse.logs[0].args.ngoAddress, custodian, "Event ngoMatch should match");

  
        assert.equal(actualEvent, expectedEvent, 'events should match');
      })
      it("Ensure non Owner unable to ApproveRequest", async () => {

        const nonOwner = accounts[4]
        try {
            // Attempt to call the function as a non-owner
            const failResponse = await fundraiser.approveRequest(0,{ from: nonOwner });
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            console.log("Caught error:", err.message);
            // Check for the expected error, e.g., revert
            assert.equal(err.message, "VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
            assert.include(err.message, "revert", "The error message should contain 'revert'");
           
        }
    });
    it("Ensure non Owner unable to RejectRequest", async () => {

      const nonOwner = accounts[4]
      try {
          // Attempt to call the function as a non-owner
          const failResponse = await fundraiser.approveRequest(0,{ from: nonOwner });
          assert.fail("The transaction should have thrown an error");
      } catch (err) {
          console.log("Caught error:", err.message);
          // Check for the expected error, e.g., revert
          assert.equal(err.message, "VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
          assert.include(err.message, "revert", "The error message should contain 'revert'");
         
      }
  });
  it("Edge Case: Donating with zero amount", async () => {
    try {
        await fundraiser.donate({ from: donor, value: 0 });
    
    } catch (error) {
        // Check for specific revert message or behavior
        console.log("error edge",error.message)
        assert.include(error.message, "The transaction should have failed with zero donation amount", "Should not accept zero donation");
    }
});
it("Edge Case: Donating with negative amount", async () => {
  try {
      await fundraiser.donate({ from: donor, value: -1 });
  
  } catch (error) {
      // Check for specific revert message or behavior
      console.log("error lala",error.message)
      assert.include(error.message, 'Cannot wrap string value "-0x1"', "Should not accept negative donation");
  }
});

it("Unable to Donate with Insufficient Amount", async () => {
  const donorBalance = await web3.eth.getBalance(donor);
  const excessiveDonationAmount = web3.utils.toBN(donorBalance).add(web3.utils.toBN(1)); // Amount greater than the donor's balance

  try {
      // Attempt to donate an excessive amount
      await fundraiser.donate({ from: donor, value: excessiveDonationAmount });
      assert.fail("The donation should have failed due to insufficient funds");
  } catch (error) {

      assert.include(error.message, "insufficient funds", "Expected an error for insufficient funds");
  }
});

it("Unable to Donate with Insufficient Amount", async () => {
  const donorBalance = await web3.eth.getBalance(donor);
  const excessiveDonationAmount = web3.utils.toBN(donorBalance).add(web3.utils.toBN(1)); // Amount greater than the donor's balance

  try {
      // Attempt to donate an excessive amount
      await fundraiser.donate({ from: donor, value: excessiveDonationAmount });
      assert.fail("The donation should have failed due to insufficient funds");
  } catch (error) {

      assert.include(error.message, "insufficient funds", "Expected an error for insufficient funds");
  }
});


it("Unable to Create Request with Exceeding the Current Fundraise Amount", async () => {
  const contractBalance = await web3.eth.getBalance(fundraiser.address);
  const excessiveRequestAmount = web3.utils.toBN(contractBalance).add(web3.utils.toBN(1)); // Amount greater than the contract's balance

 
  try {

      await fundraiser.createRequest(beneficiary,excessiveRequestAmount);
      assert.fail("The request approval should have failed due to insufficient contract funds");
  } catch (error) {
      // Check for the specific error indicating insufficient funds in the contract
      console.log("kmeme",error.message)
      assert.include(error.message, "revert Insufficient funds for request", "Insufficient fund request");
  }
});
it("Unable to Approve Request with insufficient fund", async () => {
  const contractBalance = await web3.eth.getBalance(fundraiser.address);
  const excessiveRequestAmount = web3.utils.toBN(contractBalance).add(web3.utils.toBN(1)); // Amount greater than the contract's balance

 
  try {
      await fundraiser.createRequest(beneficiary,web3.utils.toWei('1.5'));
      await fundraiser.approveRequest(0,{from:custodian});
      await fundraiser.createRequest(beneficiary,contractBalance);
      await fundraiser.approveRequest(0,{from:custodian});
    

      assert.fail("The request approval should have failed due to insufficient contract funds");
  } catch (error) {
      // Check for the specific error indicating insufficient funds in the contract
      console.log("kmeme",error.message)
      assert.include(error.message, "revert Insufficient funds for request", "Insufficient fund request");
  }
});


});
    


});
