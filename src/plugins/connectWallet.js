import walletManager from "~/blockchain/utils/walletManager";
import TransactionServices from "~/blockchain/utils/TransactionServices";
// import { initWeb3 } from '~/blockchain/utils/support/initWeb3'
import { initWeb3 } from "~/blockchain/utils/support/initWeb3";
// import { setupNetwork } from '~/blockchain/utils/network'

const supportUpdateStore = (context, transactions) => {
  context.store.dispatch(
    "walletStore/changeCurrentAddress",
    walletManager.currentAddress()
  );
  // context.store.dispatch('walletStore/changeTransactionHistory', transactions)
  context.store.dispatch(
    "walletStore/changeSupportTokenAndBalance",
    walletManager.tokens()
  );
};

export default (context, inject) => {
  const connectWallet = async (walletName, connectExist = true) => {
    // try {
    // connextExist before run code below, if no connectExist run connectWallet first time
    if (connectExist) {
      if (walletName !== "walletConnect") {
        try {
          await context.store.dispatch("walletStore/changeLoadingWallet", true);
          setTimeout(async () => {
            await context.store.dispatch(
              "walletStore/changeLoadingWallet",
              false
            );
          }, 5000);

          // check account if connect exist before
          const web3 = await initWeb3();

          const checked = await web3.eth.getAccounts();

          // detect account changed
          window.ethereum.on("accountsChanged", async function (accounts) {
            await walletManager.connectWallet(walletName, 0);
            const transactions = await TransactionServices.getTransactions(
              walletManager.currentAddress()
            );

            supportUpdateStore(context, transactions);
          });

          // detect network changed
          window.ethereum.on("networkChanged", function (networkId) {
            console.log("networkChanged", networkId);
          });

          // window.BinanceChain.on('accountsChanged', async function (accounts) {
          //   await walletManager.connectWallet(walletName, 0)
          //   const transactions = await TransactionServices.getTransactions(walletManager.currentAddress())

          //   supportUpdateStore(context, transactions)
          // })

          if (!checked.length) {
            throw new Error(`no connect ${walletName}`);
          }
          await walletManager.connectWallet(walletName, 0);
          const transactions = await TransactionServices.getTransactions(
            walletManager.currentAddress()
          );

          supportUpdateStore(context, transactions);
        } catch (error) {
          console.log(error, "walletconnect");
        } finally {
          await context.store.dispatch(
            "walletStore/changeLoadingWallet",
            false
          );
        }
      }
    } else {
      try {
        await context.store.dispatch("walletStore/changeLoadingWallet", true);
        setTimeout(async () => {
          await context.store.dispatch(
            "walletStore/changeLoadingWallet",
            false
          );
        }, 5000);
        await walletManager.connectWallet(walletName, 0);
        const transactions = await TransactionServices.getTransactions(
          walletManager.currentAddress()
        );

        supportUpdateStore(context, transactions);
      } catch (error) {
        console.log(error, "connect");
      } finally {
        await context.store.dispatch("walletStore/changeLoadingWallet", false);
      }
    }
    // } catch (error) {
    // }
  };

  // Inject $connectWallet(item) in Vue, context, and store
  inject("connectWallet", connectWallet);
  context.$connectWallet = connectWallet;
};
