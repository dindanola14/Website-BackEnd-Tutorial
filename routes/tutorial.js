//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
//const { ValidationErrorItemType } = require('sequelize/types');
const tutorial = model.tutorial

//endpoint menampilkan semua data tutorial, method: GET, function: findAll()
app.get("/", async (req,res) => {
    let result = await tutorial.findAll({
        include: [
            "category"
        ]
    })
    res.json(result)
})

app.get("/category/:id_category", async (req, res) => {
    console.log(req.params.id_category);
    let param = {id_category: req.params.id_category}
    let result = await tutorial.findAll({
        where: param,
        order: [
            ["id", "ASC"]
        ],
        include: [
            "category"
        ]
    })
    res.json(result)
});

app.get("/:id", async (req, res) => {
    tutorial
    .findOne({ 
        where: { id: req.params.id },
        include: [
            {
                model: model.detail,
                as: "detail"
            }
        ] })
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.json({
            message: error.message,
        });
    });
    res.json(result)
});

//endpoint untuk menyimpan data tutorial, METHOD: POST, function: create
app.post("/", (req,res) => {
    let dataBody = req.body;
    if (dataBody instanceof Array) {
    for (let index = 0; index < dataBody.length; index++) {
        const element = dataBody[index];

        let data = {
            id_category: element.id_category,
            title : element.title,
            createdBy : req.query.user_id,
            createdAt : new Date,
            updatedAt : new Date
        }
        if(dataBody.length==1){
            tutorial.create(data)
                .then(result => {
                    console.log(result)
                    res.json([result])
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        message: error.message
                    })
                    return;
                })
        } else {
            tutorial.create(data)
                .then(result => {
                    console.log(result)
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        message: error.message
                    })
                    return;
                })
            }
    }
    if(dataBody.length>1){
        res.json(dataBody)
        }
    }
})

//endpoint mengupdate data tutorial, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id : req.params.id
    }
    let data = {
        title : req.body.title,
        updatedBy : req.query.user_id

    }
    tutorial.update(data, {where: param})
        .then(() => {
            res.json(data)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data tutorial, METHOD: DELETE, function: destroy
app.delete("/:id", (req,res) => {
    let param = {
        id : req.params.id
    }
    tutorial.destroy({where: param})
        .then(() => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app