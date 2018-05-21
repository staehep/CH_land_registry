// Contract to be tested
var Grundbuch = artifacts.require("../contracts/Grundbuch");

// Test
contract('Grundbuch', function(accounts) {
  var LandTitleInstance;
  var landRegistry1 = accounts[0];
  var landRegistry2	= accounts[1];
  
  var ownerName1 	= "Pascal Stäheli";
  var ownerName1_updated = "Daniel Zigerlig";
  var eGrid1 		= "ABCD123456";
  var linkToPrivateData1 = "www.dropbox.com";
  var privateDataHash1 = "127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935";
  
  var ownerName2 	= "Thomas Keller";
  var eGrid2 		= "WXYZ987654";
  var linkToPrivateData2 = "www.dropbox.com";
  var privateDataHash2 = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
  

  // Case: check initial values
  it("should be initialized with empty values", function() {
    return Grundbuch.deployed().then(function(instance) {
      return instance.getNumberOfLandRegistered();
    }).then(function(data) {
      assert.equal(data, 30, "number of initial registered lands must be 30");
    });
  });

  // Case 1: Register first land title
  it("should let us register first land title", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.registerLand(eGrid1, ownerName1, linkToPrivateData1, privateDataHash1,  {
        from: landRegistry1});
    }).then(function(receipt) {
      //check event
      assert.equal(receipt.logs.length, 1, "should have received one event");
      assert.equal(accounts.length, 10, "number of accounts must be ten")
      assert.equal(receipt.logs[0].event, "registerLandEvent", "event name should be registerLandEvent");
      assert.equal(receipt.logs[0].args._id.toNumber(), 31, "id must be 31");
      assert.equal(receipt.logs[0].args._landRegistry, landRegistry1, "Land Registry must be " + landRegistry1);
      assert.equal(receipt.logs[0].args._landOwnerName, ownerName1, "land owner name must be " + ownerName1);
      assert.equal(receipt.logs[0].args._egrid, eGrid1, "eGrid must be " + eGrid1);
      assert.equal(receipt.logs[0].args._linkToPrivateData, linkToPrivateData1, "link to private data must be " + linkToPrivateData1);
      assert.equal(receipt.logs[0].args._privateDataHash, privateDataHash1, "private data hash must be " + privateDataHash1);

      return landTitleInstance.getNumberOfLandRegistered();
    }).then(function(data) {
      assert.equal(data, 31, "number of register land must be one");

      return landTitleInstance.getRegisteredLandList();
    })
    .then(function(data) {
      assert.equal(data.length, 31, "there must now be 31 land registered");
      registeredLandId1 = data[30].toNumber();
      assert.equal(registeredLandId1, 30, "registered land id must be 30");

      return landTitleInstance.getLandInformationById(registeredLandId1);
    })
    .then(function(data) {
      assert.equal(data[0].toNumber(), 30, "registered land id must be 30");
      assert.equal(data[1], landRegistry1, "land owner must be " + landRegistry1);
      assert.equal(data[2], eGrid1, "eGrid must be " + eGrid1);
      assert.equal(data[3], ownerName1, "owner name must be " + ownerName1);
    });
  });
  
   // Case 2: Register second land title
  it("should let us register second land title", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.registerLand(eGrid2, ownerName2, linkToPrivateData2, privateDataHash2, {
        from: landRegistry2});
    }).then(function(receipt) {
      //check event
      assert.equal(receipt.logs.length, 1, "should have received one event");
      assert.equal(receipt.logs[0].event, "registerLandEvent", "event name should be registerLandEvent");
      assert.equal(receipt.logs[0].args._id.toNumber(), 32, "id must be 32");
      assert.equal(receipt.logs[0].args._landRegistry, landRegistry2, "Land Registry must be " + landRegistry2);
      assert.equal(receipt.logs[0].args._landOwnerName, ownerName2, "land owner name must be " + ownerName2);
      assert.equal(receipt.logs[0].args._egrid, eGrid2, "eGrid must be " + eGrid2);
      assert.equal(receipt.logs[0].args._linkToPrivateData, linkToPrivateData2, "link to private data must be " + linkToPrivateData2);
      assert.equal(receipt.logs[0].args._privateDataHash, privateDataHash2, "private data hash must be " + privateDataHash2);

      return landTitleInstance.getNumberOfLandRegistered();
    }).then(function(data) {
      assert.equal(data, 32, "number of register land must be 32");

      return landTitleInstance.getRegisteredLandList();
    })
    .then(function(data) {
      assert.equal(data.length, 32, "there must now be 2 land title registered");
      registeredLandId2 = data[31].toNumber();
      assert.equal(registeredLandId2, 31, "registered land id must be 31");

      return landTitleInstance.getLandInformationById(registeredLandId2);
    })
    .then(function(data) {
      assert.equal(data[0].toNumber(), 31, "registered land id must be 31");
      assert.equal(data[1], landRegistry2, "land owner must be " + landRegistry2);
      assert.equal(data[2], eGrid2, "eGrid must be " + eGrid2);
      assert.equal(data[3], ownerName2, "owner name must be " + ownerName2);
    });
  });

  it("should return land if egrid is valid", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.getLandInformation(eGrid1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 30, "registered land id must be 30");
      assert.equal(data[1], landRegistry1, "land owner must be " + landRegistry1);
      assert.equal(data[2], eGrid1, "eGrid must be " + eGrid1);
      assert.equal(data[3], ownerName1, "owner name must be " + ownerName1);
    });
  });

  it("should return full land information if secret is valid", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.getFullLandInformation(eGrid1, "secret_123");
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 30, "registered land id must be 30");
      assert.equal(data[1], landRegistry1, "land owner must be " + landRegistry1);
      assert.equal(data[2], eGrid1, "eGrid must be " + eGrid1);
      assert.equal(data[3], ownerName1, "owner name must be " + ownerName1);
      assert.equal(data[4], linkToPrivateData1, "link to private data must be " + linkToPrivateData1);
      assert.equal(data[5], privateDataHash1, "private data hash must be " + privateDataHash1);
    });
  });

  it("should not return full land information if secret is invalid", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.getFullLandInformation(eGrid1, "random secret");
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    });
  });

  it("should not return valid data if egrid is not found", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.getLandInformation("123123123");
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 0, "registered land id must be 0");
      assert.equal(data[1], "0x0000000000000000000000000000000000000000", "land owner must be 0x0000000000000000000000000000000000000000");
      assert.equal(data[2], "", "eGrid must be empty");
      assert.equal(data[3], "", "owner name must be empty");
    });
  });

  it("should not register land if egrid is already in use", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;
      return landTitleInstance.registerLand(eGrid2, ownerName2, linkToPrivateData2, privateDataHash2, {
        from: landRegistry2});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      });
  })

  it("should update the land", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;

      return landTitleInstance.getRegisteredLandList();
    })
    .then(function(data) {
      assert.equal(data.length, 32, "there must now be 32 land title registered");
      return landTitleInstance.getLandInformationById(data[30].toNumber());
    }).then(function(data) {
      assert.equal(data[3], ownerName1);

      // update land
      return landTitleInstance.updateLand(eGrid1, ownerName1_updated, linkToPrivateData1, privateDataHash1, { from: landRegistry1 });
    })
    .then(function(receipt) {
      //check event
      assert.equal(receipt.logs.length, 1, "should have received one event");
      assert.equal(receipt.logs[0].event, "updateLandEvent", "event name should be updateLandEvent");
      assert.equal(receipt.logs[0].args._landRegistry, landRegistry1, "Land Registry must be " + landRegistry1);
      assert.equal(receipt.logs[0].args._newLandOwnerName, ownerName1_updated, "new land owner name must be " + ownerName1_updated);
      assert.equal(receipt.logs[0].args._egrid, eGrid1, "eGrid must be " + eGrid1);

      return landTitleInstance.getRegisteredLandList();
    })
    .then(function(data) {  
      assert.equal(data.length, 32, "there must now be 32 land title registered");
      return landTitleInstance.getLandInformationById(data[30].toNumber());
    }).then(function(land) {
      assert.equal(land[3], ownerName1_updated, "new land owner name must be " + ownerName1_updated);
    });
  });

  it("should not update the land if the land registry doesnt match", function() {
    return Grundbuch.deployed().then(function(instance) {
      landTitleInstance = instance;

      return landTitleInstance.updateLand(eGrid2, ownerName1_updated, linkToPrivateData1, privateDataHash1, { from: landRegistry1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    });
  });

});
