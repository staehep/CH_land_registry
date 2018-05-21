pragma solidity ^0.4.11;

contract Grundbuch {
  address constant public addressRegistry1 = 0x8879668bCC57F0F2964c7eaDd4B5cCB99151180D;
  address constant public addressRegistry2 = 0x3155bA7b969aF228c783195E88A5140BcAB71576;
  address constant public addressRegistry3 = 0x276FE15607DC548738ad6354291741ab3Ee8a492;
  string constant private master_key = "secret_123";

  struct Land {
    uint id;
    address landRegistry;
    string egrid;
    string landOwnerName;
    string linkToPrivateData;
    // to ensure that the remote data has not been changed
    string privateDataHash;
  }

  // State variables
  // declared private so only getters will return data (since there is private data in the list)
  mapping(uint => Land) private landList;
  uint landListCounter;

    // Events
  event registerLandEvent (
    uint    indexed _id,
    address indexed _landRegistry,
    string  _egrid,
    string  _landOwnerName,
    string _linkToPrivateData,
    string _privateDataHash
  );

  event updateLandEvent (
    address indexed _landRegistry,
    string _egrid,
    string _newLandOwnerName,
    string _linkToPrivateData,
    string _privateDataHash
  );

  constructor() public {
    // default land for land registry 1:
    registerLand("EGRID1", "Test Person 1", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID2", "Test Person 2", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID3", "Test Person 3", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID4", "Test Person 4", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID5", "Test Person 5", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID6", "Test Person 6", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID7", "Test Person 7", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID8", "Test Person 8", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID9", "Test Person 9", "www.dropbox.com", "A HASH", addressRegistry1);
    registerLand("EGRID10", "Test Person 10", "www.dropbox.com", "A HASH", addressRegistry1);

    // default land for amt 2:
    registerLand("EGRID11", "Test Person 11", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID12", "Test Person 12", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID13", "Test Person 13", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID14", "Test Person 14", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID15", "Test Person 15", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID16", "Test Person 16", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID17", "Test Person 17", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID18", "Test Person 18", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID19", "Test Person 19", "www.dropbox.com", "A HASH", addressRegistry2);
    registerLand("EGRID20", "Test Person 20", "www.dropbox.com", "A HASH", addressRegistry2);

    // default land for amt 3:
    registerLand("EGRID21", "Test Person 21", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID22", "Test Person 22", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID23", "Test Person 23", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID24", "Test Person 24", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID25", "Test Person 25", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID26", "Test Person 26", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID27", "Test Person 27", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID28", "Test Person 28", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID29", "Test Person 29", "www.dropbox.com", "A HASH", addressRegistry3);
    registerLand("EGRID30", "Test Person 30", "www.dropbox.com", "A HASH", addressRegistry3);
  }

  // register land with address (private)
  function registerLand(string _egrid, string _landOwnerName, string _linkToPrivateData, string _privateDataHash, address sender) private {
    landList[landListCounter] = Land(landListCounter, sender, _egrid, _landOwnerName, _linkToPrivateData, _privateDataHash);
    landListCounter++;
  }

  // register land
  function registerLand(string _egrid, string _landOwnerName, string _linkToPrivateData, string _privateDataHash) public {
    // initialize an empty address
    address NULL_ADDRESS;
    // get variable to store existing address
    address existingAddress;
    // deconstructing the tuple from getLandInformation, mapping only the address field
    ( , existingAddress,,) = getLandInformation(_egrid);

    // the existingAddress should be empty in order to register a new one with the provided egrid
    require(existingAddress == NULL_ADDRESS);

    // store the Land title
    registerLand(_egrid, _landOwnerName, _linkToPrivateData, _privateDataHash, msg.sender);

    // trigger the event
    emit registerLandEvent(landListCounter, msg.sender, _egrid, _landOwnerName, _linkToPrivateData, _privateDataHash);
  }

  // fetch the number of Land registered in the contract
  function getNumberOfLandRegistered() public view returns (uint) {
    return landListCounter;
  }

  // returns land information
  function getLandInformation(string _egrid) public view returns(uint, address, string, string) {
    for (uint i = 0; i < landListCounter; i++) {
      if(keccak256(landList[i].egrid) == keccak256(_egrid)) {
        return getLandInformationById(i);
      }
    }
  }

  // returns land information by id
  function getLandInformationById(uint _id) public view returns(uint, address, string, string) {
    return (landList[_id].id, landList[_id].landRegistry, landList[_id].egrid, landList[_id].landOwnerName);
  }

  // returns full land information
  function getFullLandInformation(string _egrid, string _secret) public view returns(uint, address, string, string, string, string) {
    require(keccak256(_secret) == keccak256(master_key));
    
    for (uint i = 0; i < landListCounter; i++) {
      if(keccak256(landList[i].egrid) == keccak256(_egrid)) {
        return (landList[i].id, landList[i].landRegistry, landList[i].egrid, landList[i].landOwnerName, landList[i].linkToPrivateData, landList[i].privateDataHash);
      }
    }
  }

  // fetch and returns all land IDs getNumberOfLandRegistered
  function getRegisteredLandList() public view returns (uint[]) {
    // we check whether there is at least one registered Land
    require(landListCounter > 0);

    if (landListCounter == 0) {
      return new uint[](0);
    }

    //prepare output
    uint[] memory registeredLandList = new uint[] (landListCounter);
    for (uint i = 0; i < landListCounter; i++) {
      registeredLandList[i] = landList[i].id;
    }

    return (registeredLandList);
  }

  // update land
  function updateLand(string _egrid, string _newLandOwnerName, string _newLinkToPrivateData, string _newPrivateDataHash) public {

    // check if the land registry is entitled to update Land
    for (uint i = 0; i < landListCounter; i++) {
      // string compare
      if(keccak256(landList[i].egrid) == keccak256(_egrid)) {
        require(landList[i].landRegistry == msg.sender);
        landList[i].landOwnerName = _newLandOwnerName;
        landList[i].linkToPrivateData = _newLinkToPrivateData;
        landList[i].privateDataHash = _newPrivateDataHash;
      }
    }

    // trigger the event
    emit updateLandEvent(msg.sender, _egrid, _newLandOwnerName, _newLinkToPrivateData, _newPrivateDataHash);
  }

}
