import { Signer, Contract, providers, ethers } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import { getL1ContractData, getL2ContractData } from './contract-data'

export type Network = 'goerli' | 'kovan' | 'mainnet'
interface L1Contracts {
  addressManager: Contract
  canonicalTransactionChain: Contract
  executionManager: Contract
  fraudVerifier: Contract
  xDomainMessenger: Contract
  ethGateway: Contract
  multiMessageRelayer: Contract
  safetyChecker: Contract
  stateCommitmentChain: Contract
  stateManagerFactory: Contract
  stateTransitionerFactory: Contract
  xDomainMessengerProxy: Contract
  l1EthGatewayProxy: Contract
  mockBondManger: Contract
}

interface L2Contracts {
  eth: Contract
  xDomainMessenger: Contract
  messagePasser: Contract
  messageSender: Contract
  deployerWhiteList: Contract
  ecdsaContractAccount: Contract
  sequencerEntrypoint: Contract
  erc1820Registry: Contract
  addressManager: Contract
}

const checkSignerType = (signerOrProvider: Signer | Provider) => {
  if (!signerOrProvider) throw Error('signerOrProvider argument is undefined')
  if (
    !Provider.isProvider(signerOrProvider) &&
    !Signer.isSigner(signerOrProvider)
  )
    throw Error('signerOrProvider argument is the wrong type')
}

export const connectL1Contracts = async (
  signerOrProvider,
  network?: Network
): Promise<L1Contracts> => {
  checkSignerType(signerOrProvider)

  if (!network) {
    console.warn(
      'network argument not provided to connectL1Contracts. Defaulting to mainnet.'
    )
    network = 'mainnet'
  }
  if (network !== 'mainnet' && network !== 'kovan' && network !== 'goerli')
    throw Error('network argument is the wrong type')

  const l1ContractData = getL1ContractData(network)

  const toEthersContract = (data) =>
    new Contract(data.address, data.abi, signerOrProvider)

  return {
    addressManager: toEthersContract(l1ContractData.Lib_AddressManager),
    canonicalTransactionChain: toEthersContract(
      l1ContractData.OVM_CanonicalTransactionChain
    ),
    executionManager: toEthersContract(l1ContractData.OVM_ExecutionManager),
    fraudVerifier: toEthersContract(l1ContractData.OVM_FraudVerifier),
    xDomainMessenger: toEthersContract(
      l1ContractData.OVM_L1CrossDomainMessenger
    ),
    ethGateway: toEthersContract(l1ContractData.OVM_L1ETHGateway),
    multiMessageRelayer: toEthersContract(
      l1ContractData.OVM_L1MultiMessageRelayer
    ),
    safetyChecker: toEthersContract(l1ContractData.OVM_SafetyChecker),
    stateCommitmentChain: toEthersContract(
      l1ContractData.OVM_StateCommitmentChain
    ),
    stateManagerFactory: toEthersContract(
      l1ContractData.OVM_StateManagerFactory
    ),
    stateTransitionerFactory: toEthersContract(
      l1ContractData.OVM_StateTransitionerFactory
    ),
    xDomainMessengerProxy: toEthersContract(
      l1ContractData.Proxy__OVM_L1CrossDomainMessenger
    ),
    l1EthGatewayProxy: toEthersContract(l1ContractData.Proxy__OVM_L1ETHGateway),
    mockBondManger: toEthersContract(l1ContractData.mockOVM_BondManager),
  }
}

export const connectL2Contracts = async (
  signerOrProvider
): Promise<L2Contracts> => {
  const l2ContractData = await getL2ContractData()
  checkSignerType(signerOrProvider)

  const toEthersContract = (data) =>
    new Contract(data.address, data.abi, signerOrProvider)

  return {
    eth: toEthersContract(l2ContractData.OVM_ETH),
    xDomainMessenger: toEthersContract(
      l2ContractData.OVM_L2CrossDomainMessenger
    ),
    messagePasser: toEthersContract(l2ContractData.OVM_L2ToL1MessagePasser),
    messageSender: toEthersContract(l2ContractData.OVM_L1MessageSender),
    deployerWhiteList: toEthersContract(l2ContractData.OVM_DeployerWhitelist),
    ecdsaContractAccount: toEthersContract(
      l2ContractData.OVM_ECDSAContractAccount
    ),
    sequencerEntrypoint: toEthersContract(
      l2ContractData.OVM_SequencerEntrypoint
    ),
    erc1820Registry: toEthersContract(l2ContractData.ERC1820Registry),
    addressManager: toEthersContract(l2ContractData.Lib_AddressManager),
  }
}
