import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {ethers} from 'ethers';
import {randomBytes} from 'react-native-randombytes';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isReceiveModalVisible, setReceiveModalVisible] = useState(false);

  const showReceiveModal = () => {
    setReceiveModalVisible(true);
  };

  const hideReceiveModal = () => {
    setReceiveModalVisible(false);
  };

  const generateWallet = () => {
    const randomBytesBuffer = randomBytes(32);
    const randomBytesHex = randomBytesBuffer.toString('hex');
    console.log('randomBytesHex', randomBytesHex);
    const newWallet = new ethers.Wallet(randomBytesHex);
    console.log(newWallet);
    setWallet(newWallet);
  };

  const sendTransaction = async () => {
    if (wallet && recipientAddress && amount) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
        );
        const walletWithProvider = wallet.connect(provider);
        const amountInWei = ethers.utils.parseUnits(amount, 'ether');

        console.log(amountInWei.toString(), 'WEIIIii');
        const tx = await walletWithProvider.sendTransaction({
          to: recipientAddress,
          value: amountInWei.toString(),
        });
        console.log('TTXxxxxxxxx', tx);
        setTransactionHash(tx.hash);
      } catch (error) {
        console.error('Transaction failed:', error);
      }
    }
  };

  return (
    <View>
      {wallet ? (
        <View>
          <Text>Wallet Address: {wallet.address}</Text>
          <Button title="Receive" onPress={showReceiveModal} />
        </View>
      ) : (
        <Button title="Generate Wallet" onPress={generateWallet} />
      )}

      <TextInput
        placeholder="Recipient Address"
        value={recipientAddress}
        onChangeText={text => setRecipientAddress(text)}
      />
      <TextInput
        placeholder="Amount (in MATIC)"
        value={amount}
        onChangeText={text => setAmount(text)}
      />

      <Button title="Send Transaction" onPress={sendTransaction} />

      {transactionHash && (
        <View>
          <Text>Transaction Hash: {transactionHash}</Text>
        </View>
      )}
      <Modal isVisible={isReceiveModalVisible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <QRCode value={wallet ? wallet.address : ''} size={200} />
          <Text>Scan this QR code to receive MATIC</Text>
          <Button title="Close" onPress={hideReceiveModal} />
        </View>
      </Modal>
    </View>
  );
};

export default App;
