const { response } = require("express");
const mercadopago = require("mercadopago");

mercadopago.configure({
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
    access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398"
});

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {

        const preferenceObj = {
            items: [
                {
                    id: "1234",
                    title: req.query.title,
                    picture_url: req.query.img,
                    description: "Calzado con muucha facha",
                    quantity: 1,
                    unit_price: Number(req.query.price)
                }
            ],
            payer: {
                name: "Ryan",
                surname: "Dahl",
                email: "test_user_63274575@testuser.com",
                phone: {
                    area_code: "11",
                    number: 55556666
                },
                address: {
                    zip_code: "1234",
                    street_name: "Monroe",
                    street_number: 860
                }
            },
            payment_methods: {
                excluded_payment_methods: [
                    {
                        id: "visa"
                    },
                    {
                        id: "debvisa"
                    }
                ],
                excluded_payment_types:  [
                    {
                        id: "atm"
                    }
                ],
                installments: 12
            },
            back_urls: {
                success: "https://gonzalozevallos-taller-mp-dh.herokuapp.com/success",
                pending: "https://gonzalozevallos-taller-mp-dh.herokuapp.com/pending",
                failure: "https://gonzalozevallos-taller-mp-dh.herokuapp.com/failure"
            },
            auto_return: "approved",
            external_reference: "gonzalo.zev@gmail.com",
            notification_url: "https://gonzalozevallos-taller-mp-dh.herokuapp.com/notifications"
        }

        mercadopago.preferences.create(preferenceObj)
            .then(response => {
                const preference = response.body;

                return res.render("detail", { ...req.query, preference });
            })

    },
    success: (req, res) => {
        return res.render("success", { ...req.query })
    },
    pending: (req, res) => {
        return res.render("pending")
    },
    failure: (req, res) => {
        return res.render("failure")
    },
    notifications: (req, res) => {

        console.log(req.body);

        res.status(200).send("OK")

    }
}