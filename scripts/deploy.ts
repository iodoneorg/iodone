import { ethers } from 'hardhat'

async function main() {
  const deployer = (await ethers.getSigners())[0]

  const owner = await deployer.getAddress()
  const BASE_CPI = ethers.utils.parseEther('1')

  // deploy UFragments
  const uFragments = await (await ethers.getContractFactory('UFragments'))
    .connect(deployer)
    .deploy(owner)
  console.log('UFragments deployed to:', uFragments.address)

  // deploy Policy
  const uFragmentsPolicy = await (await ethers.getContractFactory('UFragmentsPolicy'))
    .connect(deployer)
    .deploy(owner, uFragments.address, BASE_CPI.toString())
  console.log('UFragmentsPolicy deployed to:', uFragmentsPolicy.address)

  // deploy Orchestrator
  const orchestrator = await (await ethers.getContractFactory('Orchestrator'))
    .connect(deployer)
    .deploy(uFragmentsPolicy.address)
  console.log('Orchestrator deployed to:', orchestrator.address)

  // deploy Oracle
  const oracle = await (await ethers.getContractFactory('Oracle')).connect(deployer).deploy(12)
  console.log('Oracle deployed to:', oracle.address)

  await (await uFragments.setMonetaryPolicy(uFragmentsPolicy.address)).wait()
  await (await uFragmentsPolicy.setOrchestrator(orchestrator.address)).wait()
  await (await uFragmentsPolicy.setMarketOracle(oracle.address)).wait()

  console.log('Balance: ', ethers.utils.formatUnits(await uFragments.balanceOf(owner), 9))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
