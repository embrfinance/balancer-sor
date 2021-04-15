// Example showing SOR use with Vault batchSwap & Eth in, run using: $ ts-node ./test/testScripts/swapExactOutEthOut.ts
require('dotenv').config();
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Contract } from '@ethersproject/contracts';
import { MaxUint256 } from '@ethersproject/constants';
import { SOR, SwapInfo, SwapTypes, ZERO_ADDRESS } from '../../src';
import { scale } from '../../src/bmath';

import vaultArtifact from '../../src/abi/Vault.json';
import erc20abi from '../abi/ERC20.json';

export type FundManagement = {
    sender: string;
    recipient: string;
    fromInternalBalance: boolean;
    toInternalBalance: boolean;
};

// rc01 Kovan addresses
const WETH = '0x02822e968856186a20fEc2C824D4B174D0b70502';
const BAL = '0x41286Bb1D3E870f3F750eB7E1C25d7E48c8A1Ac7';
const MKR = '0xAf9ac3235be96eD496db7969f60D354fe5e426B0';
const USDC = '0xc2569dd7d0fd715B054fBf16E75B001E5c0C1115';
const DEC = '0xC91c699D432323B020E3DE0Fc49761E040D60aB3';
const vaultAddr = '0xba1222227c37746aDA22d10Da6265E02E44400DD';

const poolsUrl = `https://storageapi.fleek.co/johngrantuk-team-bucket/poolsRc02.json`;

async function simpleSwap() {
    // If running this example make sure you have a .env file saved in root DIR with INFURA=your_key
    const provider = new JsonRpcProvider(
        `https://kovan.infura.io/v3/${process.env.INFURA}`
    );

    // Add TRADE_KEY pk to env for address that will exectute trade
    const wallet = new Wallet(process.env.TRADER_KEY, provider);
    console.log(`Trader Address: ${wallet.address}`);

    // gasPrice is used by SOR as a factor to determine how many pools to swap against.
    // i.e. higher cost means more costly to trade against lots of different pools.
    // Can be changed in future using sor.gasPrice = newPrice
    const gasPrice = new BigNumber('30000000000');
    // This determines the max no of pools the SOR will use to swap.
    const maxNoPools = 4;
    const chainId = 42;
    const tokenIn = USDC;
    // const tokenOut = WETH;
    const tokenOut = ZERO_ADDRESS;
    const swapType = SwapTypes.SwapExactOut; // Two different swap types are used: SwapExactIn & SwapExactOut
    const amountOut = new BigNumber(0.0001); // In normalized format, i.e. 1USDC = 1
    const decimalsOut = 18;

    const sor = new SOR(provider, gasPrice, maxNoPools, chainId, poolsUrl);

    // This calculates the cost to make a swap which is used as an input to sor to allow it to make gas efficient recommendations.
    // Can be set once and will be used for further swap calculations.
    // Defaults to 0 if not called or can be set manually using: await sor.setCostOutputToken(tokenOut, manualPriceBn)
    await sor.setCostOutputToken(tokenOut);

    // This fetches all pools list from URL in constructor then onChain balances using Multicall
    await sor.fetchPools();
    const isFinishedFetchingOnChain = sor.finishedFetchingOnChain;
    console.log(`isFinishedFetchingOnChain ${isFinishedFetchingOnChain}`);

    const swapInfo: SwapInfo = await sor.getSwaps(
        tokenIn,
        tokenOut,
        swapType,
        amountOut
    );

    console.log(swapInfo.returnAmount.toString());
    console.log(swapInfo.swaps);

    // The rest of the code executes a swap using wallet funds

    // Vault needs approval for swapping
    // console.log('Approving vault...');
    // let tokenInContract = new Contract(tokenIn, erc20abi, provider);

    // const balance = await tokenInContract.balanceOf(wallet.address);
    // console.log(`Balance: ${balance.toString()}`);
    // const allowance = await tokenInContract.allowance(
    //     wallet.address,
    //     vaultAddr
    // );
    // console.log(`Allow: ${allowance.toString()}`);

    // let txApprove = await tokenInContract.connect(wallet).approve(vaultAddr, MaxUint256);
    // console.log(txApprove);

    const vaultContract = new Contract(vaultAddr, vaultArtifact, provider);
    vaultContract.connect(wallet);

    const funds: FundManagement = {
        sender: wallet.address,
        recipient: wallet.address,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0

    const limits = [];
    swapInfo.tokenAddresses.forEach((token, i) => {
        if (token.toLowerCase() === tokenIn.toLowerCase()) {
            limits[i] = swapInfo.returnAmount.toString();
        } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
            // This should be amt + slippage in UI
            limits[i] = scale(amountOut, decimalsOut)
                .times(-1)
                .toString();
        } else {
            limits[i] = '0';
        }
    });

    console.log(swapType);
    console.log(swapInfo.tokenAddresses);
    console.log(limits);

    const deadline = MaxUint256;
    console.log('Swapping...');

    let tx = await vaultContract
        .connect(wallet)
        .batchSwap(
            swapType,
            swapInfo.swaps,
            swapInfo.tokenAddresses,
            funds,
            limits,
            deadline,
            {
                gasLimit: '200000',
                gasPrice: '20000000000',
            }
        );

    console.log(`tx: ${tx.hash}`);
}

simpleSwap();