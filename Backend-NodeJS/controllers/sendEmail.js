const AWS = require("aws-sdk");
const config = require("config");
const bodyParser = require("body-parser");

exports.emailViaAWS_SES = function (req, res, next) {
  console.log(req.body);
  console.log(req.body.email);
  AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.region,
  });

  const ses = new AWS.SES({ apiVersion: "2010-12-01" });

  //For Sender
  const params1 = {
    Destination: {
      ToAddresses: [req.body.email], // Email address/addresses that you want to send your email
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            "<html><h2>Message </h2><h3>Name: " +
            req.body.name +
            "</h3><h3>Email: " +
            req.body.email +
            "</h3><h3>Message: " +
            req.body.message +
            "</h3></html>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "message from user",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Message from " + req.body.name,
      },
    },
    Source: config.AWS.SenderEmailId,
  };

  const sendEmailSender = ses.sendEmail(params1).promise();

  sendEmailSender
    .then((data) => {
      console.log("email submitted to SES", data);
      res.status(200).send({
        message: "Message send successfully !",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send({
        message: "Failed to send !",
      });
    });
};
