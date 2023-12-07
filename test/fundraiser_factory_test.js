const FundraiserFactoryContract = artifacts.require('FundraiserFactory');
const FundraiserContract = artifacts.require('Fundraiser');

contract('FundraiserFactory: deployment', (accounts) => {
  let fundraiserFactory
  const name = 'Beach cleaning';
  const image = 'https://images.unsplash.com/photo-1554265352-d7fd5129be15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend id enim convallis tempus.';
  const goalAmount = '10';

  before(async () => {
   
    const fundraiserFactoryDeployed = await FundraiserFactoryContract.new();
    fundraiserFactory = await FundraiserFactoryContract.at(fundraiserFactoryDeployed.address);
 
  });

  it('Create the Fundraiser', async () => {
    const currentFundraisersCount = await fundraiserFactory.fundraisersCount();
    const newFundraiser = await fundraiserFactory.createFundraiser(
      name, image, description, goalAmount
    );

    const newFundraiserReceipt = await web3.eth.getTransactionReceipt(newFundraiser.tx);
    console.log(`Gas used in createFundraiser: ${newFundraiserReceipt.gasUsed}`);
    const newFundraisersCount = await fundraiserFactory.fundraisersCount();

    assert.equal(
      newFundraisersCount - currentFundraisersCount,
      1,
      'should increment by 1'
    );
  });

  it('Emit the FundraiserCreated event', async () => {
    const tx = await fundraiserFactory.createFundraiser(
      name, image, description, goalAmount
    );
    const gasUsed = tx.receipt.gasUsed;
    console.log(`Gas used: ${gasUsed}`);  
    const expectedEvent = 'FundraiserCreated';
    const actualEvent = tx.logs[0].event;
    console.log("expected event run")
    assert.equal(actualEvent, expectedEvent, 'events should match');
    assert.equal(tx.logs[0].args.owner, accounts[0], 'events should match');


  });
  it('Get Fundraise Views', async () => {
    // Create some fundraisers for testing
    const project_one = await fundraiserFactory.createFundraiser(
      'Fundraiser 1', 'Image 1', 'Description 1', '100'
    );
    const project_two = await fundraiserFactory.createFundraiser(
      'Fundraiser 2', 'Image 2', 'Description 2', '200'
    );
  
    // Specify the limit and offset for retrieving fundraisers
    const limit = 10;
    const offset = 0;
  
    // Call the fundraisers function to retrieve fundraisers
    const fundraisers = await fundraiserFactory.fundraisers(limit, offset);
  
    // Perform assertions on the retrieved fundraisers
    assert.isArray(fundraisers, 'fundraisers should be an array');
    console.log("fundraisers one list",fundraisers[0])

  });

  it('Get Fundraise Views', async () => {
    // Create some fundraisers for testing
    const project_one = await fundraiserFactory.createFundraiser(
      'Fundraiser 1', 'Image 1', 'Description 1', '100'
    );
    const project_two = await fundraiserFactory.createFundraiser(
      'Fundraiser 2', 'Image 2', 'Description 2', '200'
    );
  
    // Specify the limit and offset for retrieving fundraisers
    const limit = 10;
    const offset = 0;
    // Call the fundraisers function to retrieve fundraisers
    const fundraisers = await fundraiserFactory.fundraisers(limit, offset);
    // Perform assertions on the retrieved fundraisers
    assert.isArray(fundraisers, 'fundraisers should be an array');
    console.log("fundraisers one list",fundraisers[0])

  });

  it('Ensure Invalid address unable to create fundraiser', async () => {
    // Create some fundraisers for testing
    
    try{
    const failedCreation = await fundraiserFactory.createFundraiser(
      'Fundraiser 1', 'Image 1', 'Description 1', '100',{ from: "0x0" }); 

    } catch (error) {
        console.log("error message is",error.message)
        assert.include(error.message, "Provided address 0x0 is invalid", "Error should contain 'invalid address'");
    }

  });

  it('Ensure Edge Case Create Fundraiser cannot be 0', async () => {
    // Create some fundraisers for testing
    
    try{
    const failedCreation = await fundraiserFactory.createFundraiser(
      'Fundraiser 1', 'Image 1', 'Description 1', 0); 

    } catch (error) {
        assert.include(error.message, "value out-of-bounds");
    }

  })
  
  it('Ensure Edge Case Create Fundraiser cannot be negative', async () => {
    // Create some fundraisers for testing
    
    try{
    const failedCreation = await fundraiserFactory.createFundraiser(
      'Fundraiser 1', 'Image 1', 'Description 1', -2); 

    } catch (error) {
        assert.include(error.message, "value out-of-bounds");
    }

  });
 


});

  


