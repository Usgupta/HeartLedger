const ethers = require('ethers');
// const Web3Modal = require('web3modal');
const Web3Modal = require('web3modal').default;


const contractAddress = "0x81692ee28072a302a7752f9c4D4945d95a42";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "setUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]
async function checkIfUserRegistered(userAddress) {
  const web3Modal = new Web3Modal();
  const provider = await web3Modal.connect();
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const contract = new ethers.Contract(contractAddress, contractABI, web3Provider.getSigner());

  try {
    const role = await contract.getUserRole(userAddress);
    console.log(`User role is: ${role}`);
    const isRegistered = role !== ethers.constants.Zero;
    console.log(`Is user registered: ${isRegistered}`);
    return isRegistered;
  } catch (error) {
    console.error('Error checking if user is registered:', error);
    return false;
  }
}

checkIfUserRegistered("0x321c7Fc9b2B2f277Ec58170dD6865C8e4ff4198D");
