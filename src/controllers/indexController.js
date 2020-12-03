const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
});

module.exports = {
  home: (req, res) => {
    return res.render("index");
  },
  detail: (req, res) => {
    return res.render("detail", { ...req.query });
  },
  callback: (req, res) => {
    console.log(req.query);
    if (req.query.status.includes("success")) {
      return res.render("succes");
    }
    if (req.query.status.includes("pending")) {
      return res.render("pending");
    }
    if (req.query.status.includes("failure")) {
      return res.render("failure");
    }
    return res.status(404).end();
  },
  notifications: (req, res) => {
    console.log(req.body);
    res.status(200).end("Ok");
  },
  buy: (req, res) => {
    const host = "https://taller-mercado-pago.herokuapp.com/";
    const url = host + "callback?status=";
    

    let preference = {
      back_urls: {
        success: url + "success",
        pending: url + "pending",
        failure: url + "failure",
      },
      notification_url: host + "notifications",
      auto_return: "approved",
      payer: {
        name: "Ryan",
        surname: "Dahl",
        email: "test_user_63274575@testuser.com",
        phone: {
          area_code: "11",
          number: 55556666,
        },
        address: {
          zip_code: "1234",
          street_name: "Monroe",
          street_number: 860,
        },
      },
      payment_methods: {
        excluded_payment_methods: [{ id: "visa" }],
        excluded_payment_types: [{ id: "atm" }],
        installments: 12,
      },
      items: [
        {
          id: 1234,
          picture_url:
            "https://taller-mercado-pago.herokuapp.com/images/products/jordan.jpg",
          title: "Nombre del Producto",
          description: "Dispositivo móvil de Tienda e-commerce",
          unit_price: Number("999"),
          quantity: 3,
        },
      ],
    };

    mercadopago.preferences
      .create(preference)
      .then((response) => {
        console.log(response);
        // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.init_point = response.body.init_point;
        res.render("confirm");
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },
};
