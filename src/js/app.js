App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Grundbuch.json", function(grundbuch) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Grundbuch = TruffleContract(grundbuch);
      // Connect provider to interact with contract
      App.contracts.Grundbuch.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Grundbuch.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.registerLandEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var grundbuchInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load number of land registered
    App.contracts.Grundbuch.deployed().then(function(instance) {
      grundbuchInstance = instance;
      return grundbuchInstance.getNumberOfLandRegistered()
      .then(function(data) {
        $("#numberOfLandRegistered").html("Number of land registered: " + data);
      });
    });

    content.show();
  },

  getLandInformation: function() {
    var egrid = $('#egridInformation').val();

    App.contracts.Grundbuch.deployed().then(function(instance) {
      grundbuchInstance = instance;
      return grundbuchInstance.getLandInformation(egrid).then(function(data) {
        console.log(data);

        var landInformation = $("#landInformation");
        landInformation.empty();

        var landInformationTemplate = "<tr><th>" + data[0] + "</th><td align=left>" + data[1] + "</td><td align=left>" + data[2] + "</td><td align=left>" + data[3] + "</td></tr>"
        landInformation.append(landInformationTemplate);
      }).catch(function(error) {
        console.log(error);
        window.alert("error in getLandInformation()");
      });
    });

    $('#landInformation').val('');
  },

  getFullLandInformation: function() {
    var egrid = $('#egridFullInformation').val();
    var pw = $('#egridFullInformationPW').val();

    App.contracts.Grundbuch.deployed().then(function(instance) {
      grundbuchInstance = instance;
      return grundbuchInstance.getFullLandInformation(egrid, pw).then(function(data) {
        console.log(data);

        var fullLandInformation = $("#fullLandInformation");
        fullLandInformation.empty();

        var fullLandInformationTemplate = "<tr><th>" + data[0] + "</th><td>" + data[1] + "</td><td>" + data[2] + "</td><td>" + data[3] + "</td><td>" + data[4] + "</td><td>" + data[5] + "</td></tr>"
        fullLandInformation.append(fullLandInformationTemplate);
      }).catch(function(error) {
        console.log(error);
        window.alert("error in getFullLandInformation()");
      });
    });

    $('#fullLandInformation').val('');
  },

  registerLand: function() {
    var egrid = $('#egrid').val();
    var landownerName = $('#landownerName').val();
    var linkToPrivateData = $('#linkToPrivateData').val();
    var privateDataHash = $('#privateDataHash').val();

    App.contracts.Grundbuch.deployed().then(function(instance) {
      grundbuchInstance = instance;
      return grundbuchInstance.registerLand(egrid, landownerName, linkToPrivateData, privateDataHash, {
        from: App.account, gas: 1200000
      }).then(function(data) {
        console.log('data: ' + JSON.stringify(data));
        $('#egrid').val('');
        $('#landownerName').val('');
        $('#linkToPrivateData').val('');
        $('#privateDataHash').val('');
      }).catch(function(error) {
        console.log(error);
        window.alert("error in registerLand()");
      });
    });
  },

  updateLand: function() {
    var egrid = $('#egridUpdate').val();
    var landownerName = $('#landownerNameUpdate').val();
    var linkToPrivateData = $('#linkToPrivateDataUpdate').val();
    var privateDataHash = $('#privateDataHashUpdate').val();

    console.log(App.account);

    App.contracts.Grundbuch.deployed().then(function(instance) {
      grundbuchInstance = instance;
      return grundbuchInstance.updateLand(egrid, landownerName, linkToPrivateData, privateDataHash, {
        from: App.account, gas: 1200000
      }).then(function(data) {
        console.log('data: ' + JSON.stringify(data));
        $('#egridUpdate').val('');
        $('#landownerNameUpdate').val('');
        $('#linkToPrivateDataUpdate').val('');
        $('#privateDataHashUpdate').val('');
      }).catch(function(error) {
        console.log(error);
        window.alert("error in updateLand()");
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
