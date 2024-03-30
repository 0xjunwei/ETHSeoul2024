// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract SoulBound is ERC721, Permissioned, Ownable {
    struct IdentityDetails {
        euint32 dateOfBirth;
        // To save on storage cost (255 possible combinations)
        // init 0 = not checked yet
        // 1 = clean
        // 2 = HIV positive
        // 3 = Common STD
        // 4 = HIV + Common STD
        euint8 medicalData;
        // 0 is all uninitialized
        euint8 criminalRecord;
        euint8 fertilityMeasure;
        euint8 marriageStatus;
        euint8 rating;
        euint32 lastExamineDate;
    }
    euint32 internal _zero32 = FHE.asEuint32(0);
    euint8 internal _zero8 = FHE.asEuint8(0);
    uint256 tokenIDCount = 0;
    mapping(address => IdentityDetails) public _identitylist;
    // Docters must be approved before they can add patient medical data into the patients record
    mapping(address => bool) internal _admin;
    // Similar to nft approval, even if nft is burnt and reminted the current approval will stick, please revoke after
    mapping(address => mapping(address dappAddress => bool))
        internal _approvedViewers;

    constructor() ERC721("PersonalIdentity", "PII") Ownable(msg.sender) {}

    modifier onlyAdmin() {
        require(_admin[msg.sender], "Caller is not an admin");
        _; // Continue executing the rest of the modified function
    }

    function addUserDOBDetails(
        address _user,
        inEuint32 memory _dateOfBirth
    ) public onlyOwner {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint32 encryptedDOB = FHE.asEuint32(_dateOfBirth);
        // Checks to see if DOB is not set already, else please burn NFT
        FHE.req(FHE.eq(_identitylist[_user].dateOfBirth, _zero32));
        _identitylist[_user].dateOfBirth = encryptedDOB;
    }

    function addMedicalData(
        address _user,
        inEuint8 memory _medicalInfo,
        inEuint32 memory _lastExamineDate
    ) public onlyAdmin {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedMedicalData = FHE.asEuint8(_medicalInfo);
        _identitylist[_user].medicalData = encryptedMedicalData;
        euint32 encryptedLastExamineDate = FHE.asEuint32(_lastExamineDate);
        _identitylist[_user].lastExamineDate = encryptedLastExamineDate;
    }

    function addCriminalRecord(
        address _user,
        inEuint8 memory __criminalRecord
    ) public onlyAdmin {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedCriminalData = FHE.asEuint8(__criminalRecord);
        _identitylist[_user].criminalRecord = encryptedCriminalData;
    }

    function addFertilityCount(
        address _user,
        inEuint8 memory __fertilityCount
    ) public onlyAdmin {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedFertilityCount = FHE.asEuint8(__fertilityCount);
        _identitylist[_user].fertilityMeasure = encryptedFertilityCount;
    }

    function addMarriageStatus(
        address _user,
        inEuint8 memory __marriageStatus
    ) public onlyAdmin {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedMarriageStatus = FHE.asEuint8(__marriageStatus);
        _identitylist[_user].marriageStatus = encryptedMarriageStatus;
    }

    function addRating(
        address _user,
        inEuint8 memory __rating
    ) public onlyAdmin {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedRating = FHE.asEuint8(__rating);
        _identitylist[_user].rating = encryptedRating;
    }

    function addAdmin(address _adminAddress) public onlyOwner {
        _admin[_adminAddress] = true;
    }

    function removeAdmin(address _addressToRemove) public onlyOwner {
        _admin[_addressToRemove] = false;
    }

    // retrieve medical data for Dapps
    function retrieveMedicalData(
        address _patientData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_patientData][msg.sender] == true,
            "no permission granted to view data"
        );
        return
            FHE.sealoutput(
                _identitylist[_patientData].medicalData,
                perm.publicKey
            );
    }

    function retrieveCriminalRecord(
        address _userData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_userData][msg.sender] == true,
            "no permission granted to view data"
        );
        return
            FHE.sealoutput(
                _identitylist[_userData].criminalRecord,
                perm.publicKey
            );
    }

    function retrieveFertilityMeasure(
        address _patientData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_patientData][msg.sender] == true,
            "no permission granted to view data"
        );
        return
            FHE.sealoutput(
                _identitylist[_patientData].fertilityMeasure,
                perm.publicKey
            );
    }

    function retrieveMarriageStatus(
        address _userData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_userData][msg.sender] == true,
            "no permission granted to view data"
        );
        return
            FHE.sealoutput(
                _identitylist[_userData].marriageStatus,
                perm.publicKey
            );
    }

    function retrieveRating(
        address _userData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_userData][msg.sender] == true,
            "no permission granted to view data"
        );
        return FHE.sealoutput(_identitylist[_userData].rating, perm.publicKey);
    }

    function retrieveLastKnownMedicalData(
        address _patientData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        // add require to prevent data from being seen
        require(
            _approvedViewers[_patientData][msg.sender] == true,
            "no permission granted to view data"
        );
        return
            FHE.sealoutput(
                _identitylist[_patientData].lastExamineDate,
                perm.publicKey
            );
    }

    // Additional function check if user is above 18 years old
    function isAboveEighteen(address _userAddress) public view returns (bool) {
        // Getting the dob, i can decrypt it as results only show true/false and it deduct the dob from current timestamp
        // Does not break privacy to know if an individual is above the age of 18
        uint256 _dateOfBirth = FHE.decrypt(
            _identitylist[_userAddress].dateOfBirth
        );
        uint256 ageInSeconds = block.timestamp - _dateOfBirth;
        uint256 eighteenYearsInSeconds = 568036800; // 18 * 365.25 * 24 * 60 * 60
        return ageInSeconds >= eighteenYearsInSeconds;
    }

    // view functions
    function approveViewingOfData(address _dappAddress) public {
        // user must have a token first
        uint256 balanceOfUser = balanceOf(msg.sender);
        require(balanceOfUser == 1, "User has not minted a token!");
        _approvedViewers[msg.sender][_dappAddress] = true;
    }

    function revokeViewingOfData(address _dappAddress) public {
        // user must have a token first
        uint256 balanceOfUser = balanceOf(msg.sender);
        require(balanceOfUser == 1, "User has not minted a token!");
        _approvedViewers[msg.sender][_dappAddress] = false;
    }

    // Custom mint function only callable by the owner
    function mint(address to, uint256 /*tokenId*/) public onlyOwner {
        // Check if user has a Token already, if they do, do not mint
        uint256 balanceOfUser = balanceOf(to);
        require(
            balanceOfUser < 1,
            "Token already minted for this user, please burn before minting again!"
        );

        _safeMint(to, tokenIDCount);
        tokenIDCount += 1;
        // initialize the structs
        _identitylist[to].dateOfBirth = _zero32;
        _identitylist[to].lastExamineDate = _zero32;
        _identitylist[to].medicalData = _zero8;
        _identitylist[to].criminalRecord = _zero8;
        _identitylist[to].fertilityMeasure = _zero8;
        _identitylist[to].marriageStatus = _zero8;
        // user app rating
        _identitylist[to].rating = _zero8;
    }

    // Modified burn function
    function burn(uint256 tokenId) public onlyOwner {
        // Use the ownerOf function to get the address associated with this tokenId
        address ownerAddress = ownerOf(tokenId);

        // burn the token
        _burn(tokenId);
        // Then, remove the entry from _identitylist
        delete _identitylist[ownerAddress];
        // Similar to nft approval, even if nft is burnt and reminted the current approval for dapp will stick, please revoke before reminting
    }

    // Override transfer functions to prevent all transfers
    function transferFrom(
        address /*from*/,
        address /*to*/,
        uint256 /*tokenId*/
    ) public virtual override {
        require(false, "Soulbound tokens cannot be transferred.");
    }

    function safeTransferFrom(
        address /*from*/,
        address /*to*/,
        uint256 /*tokenId*/,
        bytes memory /*_data*/
    ) public virtual override {
        require(false, "Soulbound tokens cannot be transferred.");
    }
}
