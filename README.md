
# Swiss Land registry Blockchain - DAPP

Follow the steps below to download, install, and run this project.

## Dependencies
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/

## Step 1. Clone the project
`git clone https://github.com/staehep/CH_land_registry.git`

## Step 2. Install dependencies
```
$ cd ch_land_registry
$ npm install
```
## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.

## Step 4. Compile & Deploy Smart Contract
`$ truffle migrate --reset`
You must migrate the Grundbuch smart contract each time your restart ganache.

## Step 5. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000