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
const category = model.category

//endpoint menampilkan semua data category, method: GET, function: findAll()
app.get("/", (req,res) => {
    category.findAll({
        order: [
            ['id', "ASC"]
        ]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menampilkan menampilkan data newest
app.get("/newest", (req,res) => {
    category.findAll({
        order: [
            ["createdAt", "DESC"],
            ["updatedAt", "DESC"]
          ],
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint untuk menampilkan data sesuai status active
app.get("/active", (req,res) => {
    let indicator = {status: "Active"}
    category.findAll({
        where: indicator,
        order: [
            ["id", "ASC"]
        ]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint untuk menampilkan data sesuai status active
app.get("/inactive", (req,res) => {
    let indicator = {status: "Inactive"}
    category.findAll({
        where: indicator,
        order: [
            ["id", "ASC"]
        ]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint untuk menampilkan data sesuai category assistant
app.get("/assistant", (req,res) => {
    let indicator = {category: "Assistant"}
    category.findAll({
        where: indicator,
        order: [
            ["id", "ASC"]
        ]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint untuk menampilkan data sesuai category assistant
app.get("/dashboard", (req,res) => {
    let indicator = {category: "Dashboard"}
    category.findAll({
        where: indicator,
        order: [
            ["id", "ASC"]
        ]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id", (req, res) => {
    category
    .findOne({ 
        where: { id: req.params.id },
        include: [
            {
                model: model.tutorial,
                as: "tutorial",
                include: [
                    {
                        model: model.detail,
                        as: "detail"
                    }
                ]
            },
        ]
    })
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.json({
            message: error.message,
        });
    });
});

//endpoint untuk menyimpan data category, METHOD: POST, function: create
app.post("/", (req,res) => {
    let dataBody = req.body;
    if (dataBody instanceof Array) {
        for (let index = 0; index < dataBody.length; index++) {
            const element = dataBody[index];
    
            let data = {
                name : element.name,
                picture : element.picture,
                detail : element.detail,
                createdBy : req.query.user_id,
                status : element.status,
                category : element.category,
                createdAt : new Date,
                updatedAt : new Date
            }
        
            if(dataBody.length==1){
                category.create(data)
                .then(result => {
                    console.log(result)
                    res.json([result])
                }) 
                .catch(error => {
                    console.log(error);
                    res.json({
                        message: error.message
                    })
                    return;
                })   
            } else {
                category.create(data)
                .then(result => {
                    console.log(result)
                }) 
                .catch(error => {
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

//endpoint mengupdate data category, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id : req.params.id
    }
    let data = {
        name : req.body.name,
        detail : req.body.detail,
        picture : req.body.picture,
        category : req.body.category,
        status : req.body.status,
        updatedBy : req.query.user_id,
        
    }
    category.update(data, {where: param})
        .then(() => {
            res.json(data)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data category, METHOD: DELETE, function: destroy
app.delete("/:id", (req,res) => {
    let param = {
        id : req.params.id
    }
    category.destroy({where: param})
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