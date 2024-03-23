module.exports = {
    mongodb: {
      // uri of mongodb
      uri: 'mongodb://35.185.74.44:30001/bookstore',
      // Other mongodb config
    },
    // Secret key for encrypt token
    jwtSecret: 'e26ba6325f42271eafb5328b114bb12404b5c7aa37ab21b51a071f78db7a6778326831383dbfd324717ccdaa41c3b417bd743686b06861ebd05016c3b7bdb2ae4e36d4f347ac2770be3c464199da717382985b5c5fbd4cde312cdb14443bee05af6c927b2697e0d986db21b02cb8a569f14561aac6cd84ae54cc7a836784787f',
    // Stripe key for pay service api
    stripeTestKey: 'sk_test_51OIEEOJTqNJJmq96EnjQhwN2HmOoTbVeH4t5LG7ShRabSmPAbNiwUDksKrusovl3lsVxVTNoH2Pi7HRONgXWoiQI00VDu0KeN2',

    email: {
      host: 'smtp.qq.com',
      port: 465,
      ifSSL: true,
      user: '1031025456@qq.com',
      authCode: 'fnpjqbbqalccbbfh',
    },

    app: {
      port: 3000,
    }
  };
  