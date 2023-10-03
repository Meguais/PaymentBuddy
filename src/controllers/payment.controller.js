const { v4: uuidv4 } = require('uuid');
const Response = require('../utils/response');
const Iyzipay = require('iyzipay');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model'); // Wallet modelini ekleyin

const addPayment = async (req, res) => {
    const id = uuidv4();

    const { price, cardUserName, cardNumber, expireDate, cvc, title, expireMonth, expireYear, address, firstname, lastname, city, country, email, usersessionid } = req.body;
    var iyzipay = new Iyzipay({
        apiKey: process.env.PAYMENT_API_KEY,
        secretKey: process.env.PAYMENT_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });
    console.log("Id : ", id);
    const data = {
        locale: "tr",
        conversationId: id,
        email,
        price,
        paidPrice: price,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        paymentChannel: "WEB",
        paymentGroup: "PRODUCT",
        paymentCard: {
            cardHolderName: cardUserName,
            cardNumber,
            expireMonth: expireMonth,
            expireYear: expireYear,
            cvc,
            address: address,
            firstname: firstname,
            lastname: lastname
        },
        buyer: {
            id: usersessionid,
            name: firstname,
            surname: lastname,
            email: email,
            identityNumber: '11111111111',
            registrationAddress: address,
            city: city,
            country: country,
        },
        billingAddress: {
            contactName: firstname + lastname,
            city: city,
            country: country,
            address: address,
        },
        basketItems: [
            {
                id: title,
                name: 'Balance',
                category1: 'Balance',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: price
            }
        ]
    };
    return new Promise(async (resolve, reject) => {
        iyzipay.payment.create(data, async function (err, result) {
            // Hata kontrolü
            if (err) {
                return reject({
                    custom: true,
                    status: 400,
                    message: err.errorMessage || err.message,
                });
            }

            // User modeline conversationId ve status bilgilerini kaydetme
            const user = new User({
                conversationId: id,
                status: result.status === "success" ? "Pending" : "Failure",
                product: result,
                email: email,
                usersessionid: usersessionid,
              });
              
              await user.save().catch((err) => console.log(err));

              if (result.status !== "success") {
                  console.log("Başarısız İşlem");
                  return reject({
                      custom: true,
                      status: 400,
                      message: result.errorMessage,
                  });
              }
  
              // Wallet kontrolü ve oluşturma
              const wallet = await Wallet.findOne({ usersessionid: usersessionid, email: email });
  
              if (!wallet) {
                  const newWallet = new Wallet({
                      usersessionid: usersessionid,
                      email: email,
                      balance: 0,
                  });
  
                  await newWallet.save();
              }
  
              return resolve(new Response(result, "Ödeme Başarılı. Megu").success(res));
          });
      });
  };
  
  module.exports = {
      addPayment,
  };