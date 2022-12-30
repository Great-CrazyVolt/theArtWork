import React, { useState } from "react";
const { ethereum } = window

export const BlockChainContext = React.createContext()

export const BlockChainProvider = ({ children }) => {

    const [currentEthAccount, setCurrentEthAccount] = useState('')

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                return 'Please install the MetaMask'
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            })

            setCurrentEthAccount(accounts[0])

        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <BlockChainContext.Provider value={ connectWallet }>
            {children}
        </BlockChainContext.Provider>
    )
}