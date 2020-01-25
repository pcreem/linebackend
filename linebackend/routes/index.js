const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')

const adminController = require('../controllers/adminController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role == 'root') { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //signin,signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUsers)

  // product
  app.get('/', productController.getProducts)
  app.get('/products/:id', productController.getProduct)
  app.post('/products/search', productController.searchProducts)

  // cart
  app.get('/cart', authenticated, cartController.getCart)// show items in cart
  app.post('/cart', authenticated, cartController.postCart)// add item to cart
  app.post('/cartItem/:id/add', authenticated, cartController.addItemQuantity)// add quantity to item
  app.post('/cartItem/:id/sub', authenticated, cartController.subItemQuantity)// sub quantity to item
  app.delete('/cartItem/:id', authenticated, cartController.deleteCartItem)

  // order
  app.get('/orders', authenticated, orderController.getOrders)
  app.post('/order', authenticated, orderController.postOrder)
  app.post('/order/:id/cancel', authenticated, orderController.cancelOrder)

  // payment
  app.get('/order/:id/payment', authenticated, orderController.getPayment)
  app.post('/newebpay/callback', orderController.newebpayCallback)

  //back
  app.get('/admin/index', authenticatedAdmin, adminController.getIndex)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/users/:id/detail', authenticatedAdmin, adminController.getUserdetail)
  app.get('/admin/create/users', authenticatedAdmin, adminController.createUser)
  app.post('/admin/users', authenticatedAdmin, adminController.postUser)
  app.get('/admin/users/:id/edit', authenticatedAdmin, adminController.editUser)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)
  app.delete('/admin/users/:id', authenticatedAdmin, adminController.deleteUser)

  app.get('/admin/farmers', authenticatedAdmin, adminController.getFarmers)
  app.get('/admin/farmers/:id/detail', authenticatedAdmin, adminController.getFarmerdetail)
  app.get('/admin/create/farmers', authenticatedAdmin, adminController.createFarmer)
  app.post('/admin/farmers', authenticatedAdmin, adminController.postFarmer)
  app.get('/admin/farmers/:id/edit', authenticatedAdmin, adminController.editFarmer)
  app.put('/admin/farmers/:id', authenticatedAdmin, adminController.putFarmer)
  app.delete('/admin/farmers/:id', authenticatedAdmin, adminController.deleteFarmer)

  app.get('/admin/orders', authenticatedAdmin, adminController.getOrders)
  app.get('/admin/orders/:id/detail', authenticatedAdmin, adminController.getOrderdetail)
  app.get('/admin/orders/:id/edit', authenticatedAdmin, adminController.editOrder)
  app.put('/admin/orders/:id', authenticatedAdmin, adminController.putOrder)
  app.delete('/admin/orders/:id', authenticatedAdmin, adminController.deleteOrder)

  app.get('/admin/products', authenticatedAdmin, adminController.getProducts)
  app.get('/admin/products/:id/detail', authenticatedAdmin, adminController.getProductdetail)
  app.get('/admin/create/products', authenticatedAdmin, adminController.createProduct)
  app.post('/admin/products', authenticatedAdmin, upload.single('image'), adminController.postProduct)
  app.get('/admin/products/:id/edit', authenticatedAdmin, adminController.editProduct)
  app.put('/admin/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
  app.delete('/admin/products/:id', authenticatedAdmin, adminController.deleteProduct)

  app.get('/admin/categories', authenticatedAdmin, adminController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, adminController.postCategory)
  app.get('/admin/categories/:id/edit', authenticatedAdmin, adminController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, adminController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, adminController.deleteCategory)

  app.get('/admin/populations', authenticatedAdmin, adminController.getPopulations)
  app.post('/admin/populations', authenticatedAdmin, adminController.postPopulation)
  app.get('/admin/populations/:id/edit', authenticatedAdmin, adminController.getPopulations)
  app.put('/admin/populations/:id', authenticatedAdmin, adminController.putPopulation)
  app.delete('/admin/populations/:id', authenticatedAdmin, adminController.deletePopulation)

  app.get('/admin/lines', authenticatedAdmin, adminController.getLines)
  app.delete('/admin/lines/:id', authenticatedAdmin, adminController.deleteLine)

  const db = require('../models')
  const Line = db.Line
  const linebot = require('linebot');
  const fs = require('fs');


  const bot = linebot({
    channelId: process.env.ChannelId,
    channelSecret: process.env.ChannelSecret,
    channelAccessToken: process.env.ChannelAccessToken
  });
  const linebotParser = bot.parser();

  const imgur = require('imgur');
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

  imgur.setClientId(IMGUR_CLIENT_ID);
  imgur.getClientId();

  let fruit = ['西瓜', '木瓜', '蕃茄', '番石榴', '香瓜', '蓮霧', '奇異果', '橘子', '柳丁', '蘋果', '榴槤', '芒果', '柚子']
  let vegetable = ['菠菜', '青江菜', '莧菜', '空心菜', '大白菜', '高麗菜', '胡蘿蔔', '馬鈴薯', '芋頭', '白花菜', '青菜花', '青椒', '苦瓜', '茄子', '洋菇', '草菇', '金針菇', '鮑魚菇', '豌豆嬰', '蘿蔔嬰', '苜蓿芽', '洋蔥', '青椒', '蔥', '蒜', '高麗菜', '苦瓜', '芥菜', '苦菜', '山蘇', '黑豆', '金針']

  //let linedata = ['農產品照片', '農產品名稱', '農產品描述', '農產品價格']
  let linedata = []

  bot.on('message', function (event) {
    console.log(event)

    event.source.profile().then(function (profile) {

      if (event.message.type == 'text') {
        let userstr = event.message.text.toLowerCase()

        if (isNaN(userstr)) {

          if (userstr.length <= 10) {
            console.log(userstr)
            switch (userstr) {
              case 'hi':
                event.reply(`hi ${profile.displayName}, 請上傳你的農產品照片`)
                break
              case 'hello':
                event.reply(`hello ${profile.displayName}, 請上傳你的農產品照片`)
                break
              case '賣完':
                event.reply(`hi ${profile.displayName}, 謝謝通知,會立刻停賣`)
                break
              case '不賣了':
                event.reply(`hi ${profile.displayName}, 謝謝通知,會立刻停賣`)
                break
              default:
                linedata[1] = userstr
                event.reply(`hi ${profile.displayName}, 收到農品名稱, 請輸入10到50字的農產品簡述`)
            }
          } else if (userstr.length > 10 && userstr.length <= 50) {
            linedata[2] = userstr
            event.reply(`收到產品描述, 請輸入價格`)
          } else {
            event.reply(`請打 0987-654-321 轉接客服人員`)
          }


        } else {
          linedata[3] = userstr
          event.reply(`收到價格,賣完或不賣了麻煩再通知我們(打 賣完 或 不賣了 都可)`)

        }


      } else if (event.message.type == 'image') {
        event.source.profile().then(function (profile) {
          event.message.content().then(function (content) {
            imgur.uploadBase64(content.toString('base64'))
              .then(function (json) {

                linedata[0] = json.data.link
                event.reply(`${profile.displayName} 謝謝,收到農產品照片. 接下來請輸入產品名稱(10個字內)`)
              })
              .catch(function (err) {
                console.error(err.message);
              });
          });
        });
      } else {
        const ffmpeg = require('fluent-ffmpeg');
        const request = require('request');
        const BufferHelper = require('bufferhelper');
        const iconv = require('iconv-lite');
        const md5 = require('md5');
        const delayed = require('delayed');

        event.message.content().then(function (content) {
          fs.writeFileSync('/upload/input.m4a', Buffer.from(content.toString('base64'), 'base64'));



          function convertFileFormat(file, destination, error, progressing, finish) {

            ffmpeg(file)
              .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
                if (error) {
                  error(err.message);
                }
              })
              .on('progress', (progress) => {
                // console.log(JSON.stringify(progress));
                console.log('Processing: ' + progress.targetSize + ' KB converted');
                if (progressing) {
                  progressing(progress.targetSize);
                }
              })
              .on('end', () => {
                console.log('converting format finished !');
                if (finish) {
                  finish();
                }
              })
              .save(destination);

          }

          convertFileFormat('/upload/input.m4a', '/upload/output.wav', function (errorMessage) {

          }, null, function () {
            console.log("success");
          });


          var apiBaseUrl = '';
          var appKey = '';
          var appSecret = '';
          var cookies;

          function SpeechApiSample() {

          }

          /**
           * Setup your authorization information to access OLAMI services.
           *
           * @param appKey the AppKey you got from OLAMI developer console.
           * @param appSecret the AppSecret you from OLAMI developer console.
           */
          SpeechApiSample.prototype.setAuthorization = function (appKey, appSecret) {
            this.appKey = appKey;
            this.appSecret = appSecret;
          }

          /**
           * Setup localization to select service area, this is related to different
           * server URLs or languages, etc.
           *
           * @param apiBaseURL URL of the API service.
           */
          SpeechApiSample.prototype.setLocalization = function (apiBaseURL) {
            this.apiBaseUrl = apiBaseURL;
          }

          /**
           * Send an audio file to speech recognition service.
           *
           * @param apiName the API name for 'api=xxx' HTTP parameter.
           * @param seqValue the value of 'seq' for 'seq=xxx' HTTP parameter.
           * @param finished TRUE to finish upload or FALSE to continue upload.
           * @param filePath the path of the audio file you want to upload.
           * @param compressed TRUE if the audio file is a Speex audio.
           */
          SpeechApiSample.prototype.sendAudioFile = function (apiName, seqValue,
            finished, filePath, compressed, event) {

            var _this = this;

            // Read the input audio file
            fs.readFile(filePath, function (err, audioData) {
              if (err) {
                console.log(err);
                throw err;
              }

              var url = _this.getBaseQueryUrl(apiName, seqValue);
              url += '&compress=';
              url += compressed ? '1' : '0';
              url += '&stop=';
              url += finished ? '1' : '0';

              // Request speech recognition service by HTTP POST
              request.post({
                url: url,
                body: audioData,
                headers: {
                  'Content-Type': 'application/octet-stream',
                  'Connection': 'Keep-Alive',
                  'Content-Length': audioData.length
                }
              }, function (err, res, body) {
                if (err) {
                  console.log(err);
                  throw err;
                }
              }).on('response', function (response) {
                var body = "";
                response.on('data', function (data) {
                  body += data;
                });
                response.on('end', function () {
                  _this.cookies = response.headers['set-cookie'];
                  console.log("\n----- Test Speech API, seq=nli,seg -----\n");
                  console.log("\nSend audio file... \n");
                  console.log('Result: ' + body);
                  console.log('Cookie: ' + _this.cookies);

                  delayed.delay(function () {
                    _this.getRecognitionResult('asr', 'nli,seg', event);
                  }, 500);
                });
              });
            });
          }

          /**
           * Get the speech recognition result for the audio you sent.
           *
           * @param apiName the API name for 'api=xxx' HTTP parameter.
           * @param seqValue the value of 'seq' for 'seq=xxx' HTTP parameter.
           */
          SpeechApiSample.prototype.getRecognitionResult = function (apiName, seqValue, event) {
            var _this = this;
            var url = this.getBaseQueryUrl(apiName, seqValue);
            url += '&stop=1';
            // Request speech recognition service by HTTP GET
            request.get({
              url: url,
              headers: {
                'Cookie': this.cookies
              }
            }, function (err, res, body) {
              if (err) {
                console.log(err);
              }
            }).on('response', function (response) {
              var bufferhelper = new BufferHelper();
              response.on('data', function (chunk) {
                bufferhelper.concat(chunk);
              });

              response.on('end', function () {
                var body = iconv.decode(bufferhelper.toBuffer(), 'UTF-8');
                var result = JSON.parse(body);
                var return_status = result['data']['asr']['final'];
                // Try to get recognition result if uploaded successfully.
                // We just check the state by a lazy way :P , you should do it by JSON.
                if (return_status !== true) {
                  console.log("\n----- Get Recognition Result -----\n");
                  // Well, check by lazy way...again :P , do it by JSON please.
                  delayed.delay(function () {
                    _this.getRecognitionResult('asr', 'nli,seg');
                  }, 500);
                } else {
                  console.log("\n----- Get Recognition Result -----\n");
                  console.log("Result:\n\n" + body);
                  event.reply(`${result.data.asr.result}`)
                }
              });
            });
          }

          /**
           * Generate and get a basic HTTP query string
           *
           * @param apiName the API name for 'api=xxx' HTTP parameter.
           * @param seqValue the value of 'seq' for 'seq=xxx' HTTP parameter.
           */
          SpeechApiSample.prototype.getBaseQueryUrl = function (apiName, seqValue) {
            var dateTime = Date.now();
            timestamp = dateTime;

            var sign = '';
            sign += this.appSecret;
            sign += 'api=';
            sign += apiName;
            sign += 'appkey=';
            sign += this.appKey;
            sign += 'timestamp=';
            sign += timestamp;
            sign += this.appSecret;
            // Generate MD5 digest.
            sign = md5(sign);

            // Assemble all the HTTP parameters you want to send
            var url = '';
            url += this.apiBaseUrl + '?_from=nodejs';
            url += '&appkey=' + this.appKey;
            url += '&api=';
            url += apiName;
            url += '&timestamp=' + timestamp;
            url += '&sign=' + sign;
            url += '&seq=' + seqValue;

            return url;
          }

          var speechApi = new SpeechApiSample();
          speechApi.setLocalization('https://tw.olami.ai/cloudservice/api');
          speechApi.setAuthorization(process.env.appKey, process.env.appSecret);
          // Start sending audio file for recognition
          speechApi.sendAudioFile('asr', 'nli,seg', true, './upload/output.wav', false, event);


        }).catch(function (e) { 
          console.error(e);
        })



      }

      if (linedata.length == 4) {
        Line.create({
          usersn: profile.userId,
          name: profile.displayName,
          image: linedata[0],
          farmname: linedata[1],
          description: linedata[2],
          price: linedata[3]
        })
        linedata = []
      }

    }) //profile括號
  });

  app.post('/linebotParser', linebotParser);

}
