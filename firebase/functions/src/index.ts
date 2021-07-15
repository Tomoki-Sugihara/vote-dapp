import * as functions from 'firebase-functions'

// import tokenArtifacts from './contracts/build/Token.json'
import { ownerAddress, ownerPrivateKey } from './utils/config'
import { getContract, getWeb3, runContract } from './utils/web3'

const miningInitialToken = async (snapshot: functions.firestore.QueryDocumentSnapshot) => {
  const { address } = snapshot.data()
  if (!address) throw new Error('Address is defined.')

  const web3 = getWeb3()
  const tokenArtifacts = require('./contracts/build/Token.json')
  const tokenContract = getContract(web3, tokenArtifacts, 1515)
  const abi = tokenContract.methods.initialToken(address).encodeABI()

  await runContract(web3, tokenContract, 1515, abi, ownerAddress, ownerPrivateKey)
}

exports.createdUsersDoc = functions
  .region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onCreate((snapshot, _context) => miningInitialToken(snapshot))
