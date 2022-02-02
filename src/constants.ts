import { Zero } from '@ethersproject/constants';
import { SwapInfo } from './types';

export const WETHADDR: { [chainId: number]: string } = {
    1: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    3: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
    4: '0x80dD2B80FbcFB06505A301d732322e987380EcD6',
    5: '0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd',
    42: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
    137: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // For Polygon this is actually wrapped MATIC
    42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    43113: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    43114: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
};

export const MULTIADDR: { [chainId: number]: string } = {
    1: '0x653f3e6c7e2ae666c22e063d87a012c2f13ea416',
    3: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
    4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
    5: '0x3b2A02F22fCbc872AF77674ceD303eb269a46ce3',
    42: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
    137: '0xa1B2b503959aedD81512C37e9dce48164ec6a94d',
    42161: '0x269ff446d9892c9e19082564df3f5e8741e190a1',
    43113: '0x53FE8639203D5dfDF735C6f8949BD340Ed6800d5',
    43114: '0x653f3e6c7e2ae666c22e063d87a012c2f13ea416',
};

export const VAULTADDR: { [chainId: number]: string } = {
    1: '0xad68ea482860cd7077a5D0684313dD3a9BC70fbB',
    3: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    4: '0xF07513C68C55A31337E3b58034b176A15Dce16eD',
    5: '0x65748E8287Ce4B9E6D83EE853431958851550311',
    42: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    137: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    42161: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    43113: '0x9aed52F3074ba468c6ad17822b8833210868c31b',
    43114: '0xad68ea482860cd7077a5D0684313dD3a9BC70fbB',
};

// Currently only used for Polygon
// ID of USDC Connecting Pool & USDC token address
export const USDCCONNECTINGPOOL: {
    [chainId: number]: { id: string; usdc: string };
} = {
    99: {
        id: 'usdcConnecting',
        usdc: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    },
};

export const STABAL3POOL: {
    [chainId: number]: { id: string; address: string };
} = {
    // TO DO - Add Mainnet info
    // TO DO - Add for Polygon for staBAL3 pairs
    1: {
        id: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
        address: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb2',
    },
    42: {
        id: '0x8fd162f338b770f7e879030830cde9173367f3010000000000000000000004d8',
        address: '0x8fd162f338b770f7e879030830cde9173367f301',
    },
    99: {
        id: 'staBal3Id',
        address: '0x06df3b2bbb68adc8b0e302443692037ed9f91b42',
    },
};

export const WETHSTABAL3: {
    [chainId: number]: { id: string; address: string };
} = {
    42: {
        id: '0x6be79a54f119dbf9e8ebd9ded8c5bd49205bc62d00020000000000000000033c',
        address: '0x6be79a54f119dbf9e8ebd9ded8c5bd49205bc62d',
    },
    99: {
        id: 'weightedWethStaBal3Id',
        address: 'weightedWethStaBal3',
    },
};

export const EMPTY_SWAPINFO: SwapInfo = {
    tokenAddresses: [],
    swaps: [],
    swapAmount: Zero,
    swapAmountForSwaps: Zero,
    tokenIn: '',
    tokenOut: '',
    returnAmount: Zero,
    returnAmountConsideringFees: Zero,
    returnAmountFromSwaps: Zero,
    marketSp: Zero.toString(),
};
