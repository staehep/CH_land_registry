var Grundbuch = artifacts.require("./Grundbuch.sol");

module.exports = function(deployer) {
  deployer.deploy(Grundbuch);
};
