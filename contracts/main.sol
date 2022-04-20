/**
 *Submitted for verification at BscScan.com on 2021-04-11
 */

// File: @openzeppelin/contracts/utils/Context.sol
// SPDX-License-Identifier: MIT

// File: contracts/NFT.sol

pragma solidity 0.8.2;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";


// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface INFT {
    function mint(
        string memory _tokenURI,
        uint256 _tokenId,
        uint256 _price,
        uint256 royalty
    ) external returns (uint256);

    function updatePrice(uint256 _tokenId, uint256 _price)
        external
        returns (bool);

    function transferNFT(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function _validate(uint256 _id) external;

    function getNFTPrice(uint256 tokenId) external view returns (uint256);

    function getRoyalty(uint256 tokenId) external view returns (uint256);

    function getTokenUrl(uint256 tokenId) external view returns (string memory);

    function getOwnerAddress(uint256 tokenId)
        external
        view
        returns (address payable);
}

contract NFT is OwnableUpgradeable, INFT,ERC721URIStorageUpgradeable {
    address payable private _contractOwner;
    mapping(uint256 => uint256) private price;
    mapping(uint256 => bool) private listedMap;
    mapping(uint256 => uint256) private royalty;
    mapping(uint256 => address) private firstOwner;

    event Purchase(
        address indexed previousOwner,
        address indexed newOwner,
        uint256 price,
        uint256 nftID,
        string uri
    );

    event Minted(
        address indexed minter,
        uint256 price,
        uint256 nftID,
        string uri
    );

    event PriceUpdate(
        address indexed owner,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 nftID
    );

    event NftListStatus(address indexed owner, uint256 nftID, bool isListed);

    function initialize(address payable owner,
        string memory name,
        string memory symbol
        ) public initializer {
        __ERC721_init(name, symbol);
         _contractOwner = owner;
    }

    // constructor(
    //     address payable owner,
    //     string memory name,
    //     string memory symbol
    // ) public ERC721(name, symbol) {
    //     _contractOwner = owner;
    // }

    function transferNFT(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _transfer(from, to, tokenId);
    }

    function mint(
        string memory _tokenURI,
        uint256 _tokenId,
        uint256 _price,
        uint256 royaltyInPercent
    ) public virtual override returns (uint256) {
        // require(
        //     msg.sender == _contractOwner,
        //     "it's not owner of this collection"
        // );
        require(
            royaltyInPercent < 21,
            "royalty is to much high. Please select in between 1%-20%"
        );
        price[_tokenId] = _price;
        listedMap[_tokenId] = false;
        royalty[_tokenId] = royaltyInPercent;
        firstOwner[_tokenId] = payable(msg.sender);
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        emit Minted(msg.sender, _price, _tokenId, _tokenURI);
        return _tokenId;
    }

    function _validate(uint256 _id) public virtual override {
        require(_exists(_id), "Error, wrong tokenId");
    }

    function getNFTPrice(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return price[tokenId];
    }

    function getRoyalty(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return royalty[tokenId];
    }

    function getOwnerAddress(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address payable)
    {
        return payable(firstOwner[tokenId]);
    }

    function getTokenUrl(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return tokenURI(tokenId);
    }

    function updatePrice(uint256 _tokenId, uint256 _price)
        public
        virtual
        override
        returns (bool)
    {
        uint256 oldPrice = price[_tokenId];
        require(
            msg.sender == ownerOf(_tokenId),
            "Error, you are not the owner"
        );
        price[_tokenId] = _price;

        emit PriceUpdate(msg.sender, oldPrice, _price, _tokenId);
        return true;
    }
}
