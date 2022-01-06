"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless v1.0! Your function executed successfully! - Shamal 2 ",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const https = require("https");
const Shopify = require("shopify-api-node");
const shopify = new Shopify({
  shopName: "eComDataSYNC",
  apiKey: "e7525efd1ed7523a7d310cc784491c07",
  password: "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",
});


exports.read = async (event) => {
  let dataString = "";

  const response = await new Promise((resolve, reject) => {
    debugger;
    const req = https.get(
      "https://e7525efd1ed7523a7d310cc784491c07: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@ecomdatasync.myshopify.com/admin/api/2021-10/products.json",
      function (res) {
        res.on("data", (chunk) => {
          debugger;
          dataString += chunk;
        });
        res.on("end", () => {
          debugger;

          resolve({
            statusCode: 200,
            body: JSON.stringify(JSON.parse(dataString), null, 4),
          });
        });
      }
    );

    req.on("error", (e) => {
      reject({
        statusCode: 500,
        body: "Something went wrong!",
      });
    });
  });

  return response;
};


exports.create = async (event) => {
  let dataString = "";

  const response = await new Promise((resolve, reject) => {
    debugger;
    try {
      const fetch = require("node-fetch");

      let settings = {
        method: "Get",
      };

      fetch(
        "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline",
        settings
      )
        .then((res) => res.json())
        .then((json) => {
          for (var i = 0; i < 4; i++) {
            // json.length
            json.id = json[i].id;
            json.name = json[i].name;
            json.price = json[i].price;
            json.image_link = json[i].image_link;
            json.brand = json[i].brand;
            json.product_type = json[i].product_type;
            json.description = json[i].description;
            console.log(json.id + " | " + json.name + " | " + json.price);

            shopify.product
              .create({
                title: json.name,
                price : json.price,
                body_html: json.description,
                vendor: json.brand,
                product_type: json.product_type,
                tags: ["Barnes \u0026 Noble", "Big Air", "John's Fav"],
                images: [{ src: json.image_link }]
               
              })
              .then((country) => console.log(country.id))
              .catch((err) => console.error(err));
          }
        });

  
    } catch (e) {
      body: JSON.stringify(e, null, 4), console.log(` e statusCode: ${e}`);
    }
  
  });
};

