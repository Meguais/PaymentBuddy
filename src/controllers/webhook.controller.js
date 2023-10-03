const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');

const Webhook = async (req, res) => {
  console.log("Webhook");
  console.log("Payment Conversation Id:", req.body.paymentConversationId);
  console.log("Status:", req.body.status);

  try {
    const { paymentConversationId, status } = req.body;

    // Users koleksiyonunda paymentConversationId'ye sahip belgeyi bulun
    const user = await User.findOne({ conversationId: paymentConversationId });

    if (!user) {
      console.log("Kullanıcı bulunamadı.");
      return res.status(404).send();
    }

    console.log("Kullanıcı bulundu. Kullanıcı email:", user.email);

    // Status değerini kontrol edin
    if (user.status === "Pending") {
      console.log("Status değeri 'Pending'. Wallet'e +10 ekleniyor.");

      // Wallet'i güncelleyin ve balance'e +10 ekleyin
      const wallet = await Wallet.findOne({ usersessionid: user.usersessionid, email: user.email });
      wallet.balance += 10;
      await wallet.save();

      console.log("Wallet güncellendi. Yeni bakiye:", wallet.balance);
    } else {
      console.log("Status değeri 'Pending' değil. İşlem yapılmadı.");
    }

    // Status değerini güncelleyin
    user.status = "SUCCESS";
    await user.save();

    console.log("Status güncellendi. Yeni status:", user.status);

    res.status(200).send();
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).send();
  }
};

module.exports = Webhook;
