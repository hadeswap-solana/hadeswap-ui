import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';


export const ConnectWalletModal = ({
  title,
  ...props
}) => {

  return <h2>Wallet modal</h2>
  // const { wallets, select } = useWallet();
  // const dispatch = useDispatch();
  // const visible = useSelector(selectWalletModalVisible);

  // return (
  //   <Modal
  //     visible={visible}
  //     title={title || 'Connect wallet'}
  //     onCancel={() =>
  //       dispatch(commonActions.setWalletModal({ isVisible: false }))
  //     }
  //     {...props}
  //   >
  //     <p className={styles.text}>
  //       Connect with one of available wallet providers or create a new wallet.
  //     </p>
  //     {wallets.map(({ adapter }, idx) => {
  //       return (
  //         <div
  //           key={idx}
  //           className={styles.wallet}
  //           onClick={() => {
  //             select(adapter.name);
  //             dispatch(commonActions.setWalletModal({ isVisible: false }));
  //           }}
  //         >
  //           <div className={styles.walletName}>
  //             <img src={adapter.icon} alt="Wallet icon" />
  //             <span>{adapter.name}</span>
  //           </div>
  //           <ArrowRightIcon fill="white" />
  //         </div>
  //       );
  //     })}
  //   </Modal>
};
