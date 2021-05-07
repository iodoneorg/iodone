import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      url: '',
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
}

export default config
