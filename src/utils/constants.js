// import Web3 from 'web3';
import { ethers } from 'ethers'
import abi from './DAO.json'

const { ethereum } = window

const CONTRACT_ADDRESS = '0x3cbC62FE51ee2fd0514a0caB7225a64679bea713'
const CONTRACT_ABI = abi.abi

export const ownerAddress = '0xfA43445307Ab9D9E52bB577c4111f0696A42913F'
let userMetamaskAddress

export const connectToMetaMask = async () => {
    let userAddress

    if (ethereum) {
        const chainId = 80001

        console.log('ethereum provider detected')
        userAddress = await ethereum.request({ method: 'eth_requestAccounts' })
        userMetamaskAddress = userAddress

        if (ethereum.networkVersion !== chainId) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(chainId) }]
                })
            } catch (error) {
                console.log(`Error while switching to polygon chain: ${error}`)
            }
        }

        new ethers.providers.Web3Provider(ethereum)
        
    } else {
        console.log(`Couldn't found the ethereum provider`)
    }

    return userAddress
}

export const getDAOContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const DAOContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    return DAOContract
}

// export const isOwner = () => {
//     if(parseInt(userMetamaskAddress) === parseInt(ownerAddress)){
//         return true
//     }

//     return false
// }