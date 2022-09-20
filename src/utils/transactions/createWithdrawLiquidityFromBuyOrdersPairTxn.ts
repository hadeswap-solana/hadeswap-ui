import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { Nft, ProvisionOrders } from '../../state/core/types';
import { chunk } from 'lodash';

const { withdrawLiquidityFromBuyOrdersPair } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFromBuyOrdersPair = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  liquidityProvisionOrders: ProvisionOrders[];
  authorityAdapter: string;
  buyOrdersAmountToDelete: number;
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityFromBuyOrdersPair: CreateWithdrawLiquidityFromBuyOrdersPair =
  async ({
    connection,
    wallet,
    pairPubkey,
    liquidityProvisionOrders,
    authorityAdapter,
    buyOrdersAmountToDelete,
  }) => {
    const trxs = [];
    const takenLpOrders = {};

    for (let i = 0; i < buyOrdersAmountToDelete / 2; i++) {
      const liquidityProvisionOrderOnEdgeToWithdraw = liquidityProvisionOrders
        .filter(
          (provisionOrder) =>
            !takenLpOrders[provisionOrder.liquidityProvisionOrder],
        )
        .reduce((maxProvisionOrder, provisionOrder) =>
          maxProvisionOrder.orderBCounter < provisionOrder.orderBCounter
            ? provisionOrder
            : maxProvisionOrder,
        );

      takenLpOrders[
        liquidityProvisionOrderOnEdgeToWithdraw.liquidityProvisionOrder
      ] = true;

      trxs.push(
        withdrawLiquidityFromBuyOrdersPair({
          programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
          connection,
          accounts: {
            liquidityProvisionOrderToReplace: new web3.PublicKey(
              liquidityProvisionOrderOnEdgeToWithdraw.liquidityProvisionOrder,
            ), // same if virtual
            liquidityProvisionOrderToWithdraw: new web3.PublicKey(
              liquidityProvisionOrderOnEdgeToWithdraw.liquidityProvisionOrder,
            ),
            pair: new web3.PublicKey(pairPubkey),
            authorityAdapter: new web3.PublicKey(authorityAdapter),
            userPubkey: wallet.publicKey,
          },
          sendTxn: sendTxnPlaceHolder,
        }),
      );
    }

    const ixsAndSigners = (await Promise.all(trxs)).map(
      ({ instructions, signers }) => ({ instructions, signers }),
    );

    const ixsAndSignersChunks = chunk(ixsAndSigners, IXNS_PER_CHUNK);

    return ixsAndSignersChunks.map((chunk) => {
      const transaction = new web3.Transaction();
      transaction.add(...chunk.map(({ instructions }) => instructions).flat());

      return {
        transaction,
        signers: chunk.map(({ signers }) => signers).flat(),
      };
    });
  };
