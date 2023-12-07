const UserAccessControl = artifacts.require("UserAccessControl");

contract("UserAccessControl", accounts => {
  const [owner, user1, user2,user3] = accounts;
  let userAccessControl;
  console.log("admin user1 user2",owner, user1, user2)

  beforeEach(async () => {
    userAccessControl = await UserAccessControl.new();
  });


  it("Ensure non-owner unable to Register", async () => {
    try {
      await userAccessControl.registerUser(user2, 1, { from: user1 }); // 1 is UserRole.Beneficiary
      assert.fail("Non Owner should not be able to register a new user");
    } catch (error) {
      console.log("error message is",error.message)
      assert(error.message, "Caught error: VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.");
    }
  });
  it('Successfully Register User', async () => {
    // Call the function
    const txResponse = await userAccessControl.registerUser(user1, 0, { from: owner });
    // Get the transaction receipt
    const txReceipt = await web3.eth.getTransactionReceipt(txResponse.tx);
  
    // Log the gas used
    console.log(`Gas used for registering a user: ${txReceipt.gasUsed}`);
  });

  it("Emit User Register Event", async () => {
    const role = 0; 
    const newUser = accounts[3]
    const tx = await userAccessControl.registerUser(newUser, role);
    // Check that the UserRegistered event was emitted
    assert.equal(tx.logs[0].event, "UserRegistered",);
    // Check the parameters of the UserRegistered event
    assert.equal(tx.logs[0].args.user, newUser, "Event user parameter should match newUser");
    assert.equal(tx.logs[0].args.role.toNumber(), role, "Event role parameter should match role");
});

it("Disable Registered User to Register", async () => {
  
  try {
      await userAccessControl.registerUser(user1, 1); 
  } catch (error) {
      console.log("error message is",error.message)
      assert.include(error.message, "revert", "Error should contain 'revert'");
  }
});



  it("Ensure non-owner unable to Set Address", async () => {
    const role = 0; 
    const newUser = accounts[3]
    const tx = await userAccessControl.setUser(newUser, role);
    try {
        await userAccessControl.setUser(newUser, role, { from: accounts[2] }); // 0 is assumed to be a valid role enum
    } catch (error) {
        console.log("error message is",error.message)
        assert.include(error.message, "revert", "Error should contain 'revert'");
    }
});

it("Ensure Invalid address unable to Register", async () => {
    let invalidAddress = "0xasd32";
    try {
        await userAccessControl.registerUser(invalidAddress, 0, { from: owner }); // 0 is assumed to be a valid role enum
    } catch (error) {
        console.log("error message is",error.message)
        assert.include(error.message, "invalid address", "Error should contain 'invalid address'");
    }
});
it("Get User Role", async () => {
  const role = 0;
  const newUser = user3;

  await userAccessControl.setUser(newUser, role, { from: owner });
  const userRole = await userAccessControl.getUserRole(newUser);

  assert.equal(userRole.toNumber(), role, "User role should match the assigned role");
});

it("Check User Registration Status", async () => {
  const newUser = user3;

  await userAccessControl.setUser(newUser, 0);
  const result = await userAccessControl.users(newUser)
  const isRegistered = result.isRegistered

  console.log("isreg", isRegistered)

  assert.isTrue(isRegistered, "User should be registered");
});

it("Attempt to Set Invalid Role", async () => {
  const newUser = user3;
  const invalidRole = 3; // Assuming 3 is an invalid role enum

  try {
    await userAccessControl.setUser(newUser, invalidRole, { from: owner });
    assert.fail("Setting an invalid role should throw an exception");
  } catch (error) {
    assert.include(
      error.message,
      "revert",
      "Error should contain 'revert'"
    );
  }
});


  

});