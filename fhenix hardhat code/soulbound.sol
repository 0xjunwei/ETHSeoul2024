// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract SoulBound is ERC721, Permissioned, Ownable {
    struct IdentityDetails {
        euint32 dateOfBirth;
        // init 0 = not checked yet
        // 1 = clean
        // 2 = HIV positive
        euint8 medicalData;
    }
    euint32 internal _zero32 = FHE.asEuint32(0);
    euint8 internal _zero8 = FHE.asEuint8(0);
    uint256 tokenIDCount = 0;
    mapping(address => IdentityDetails) public _identitylist;
    mapping(address => bool) internal _admin;
    mapping(address => address) internal _approvedViewers;

    constructor() ERC721("PersonalIdentity", "PII") Ownable(msg.sender) {}

    function addUserDOBDetails(
        address _user,
        inEuint32 memory _dateOfBirth
    ) public onlyOwner {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint32 encryptedDOB = FHE.asEuint32(_dateOfBirth);
        // Checks to see if DOB is not set already, else please burn NFT
        FHE.req(_identitylist[_user].dateOfBirth.eq(_zero32));
        _identitylist[_user].dateOfBirth = encryptedDOB;
    }

    function addMedicalData(
        address _user,
        inEuint8 memory _medicalInfo
    ) public onlyOwner {
        uint256 balanceOfUser = balanceOf(_user);
        require(balanceOfUser == 1, "User has not minted a token!");
        euint8 encryptedMedicalData = FHE.asEuint8(_medicalInfo);
        _identitylist[_user].medicalData = encryptedMedicalData;
    }

    function addAdmin(address _adminAddress) public onlyOwner {
        _admin[_adminAddress] = true;
    }

    function removeAdmin(address _addressToRemove) public onlyOwner {
        _admin[_addressToRemove] = false;
    }

    // retrieve medical data from onlyAdmin
    function retrieveMedicalData(
        address _patientData,
        Permission memory perm
    ) public view onlySender(perm) returns (bytes memory) {
        return
            FHE.sealoutput(
                _identitylist[_patientData].medicalData,
                perm.publicKey
            );
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
        // initialize the structs
        _identitylist[to].dateOfBirth = _zero32;
        _identitylist[to].medicalData = _zero8;
        tokenIDCount += 1;
    }

    // Modified burn function
    function burn(uint256 tokenId) public onlyOwner {
        // Use the ownerOf function to get the address associated with this tokenId
        address ownerAddress = ownerOf(tokenId);

        // burn the token
        _burn(tokenId);
        // Then, remove the entry from _identitylist
        delete _identitylist[ownerAddress];
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
