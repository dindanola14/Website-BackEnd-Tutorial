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
const detail = model.detail

//endpoint menampilkan semua data detail, method: GET, function: findAll()
app.get("/", async (req,res) => {
    let result = await detail.findAll({
        include: [
            "tutorial"
        ]
    })
    res.json(result)
})

app.get("/:id_tutorial", async (req, res) => {
    let param = {id_tutorial: req.params.id_tutorial}
    let result = await detail.findAll({
        where: param,
        include: [
            "tutorial"
        ]
    })
    res.json(result)
});

//endpoint untuk menyimpan data detail, METHOD: POST, function: create
app.post("/", (req,res) => {
    let dataBody = req.body;
    for (let index = 0; index < dataBody.length; index++) {
        const element = dataBody[index];

        let data = {
            id_tutorial: element.id_tutorial,
            name : element.name,
            deskripsi : element.deskripsi,
            picture : element.picture,
            video : element.video,
            createdBy : req.query.user_id,
            createdAt : new Date,
            updatedAt : new Date
        }
    
        detail.create(data)
            .catch(error => {
                console.log(error)
                res.json({
                    message: error.message
                })
                return;
            })   
    }

    res.json({
        message: "data has been inserted"
    })
})

//endpoint mengupdate data detail, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id_detail : req.params.id
    }
    let data = {
        updatedBy : req.query.user_id,
        status : req.body.status,
    }
    detail.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data detail, METHOD: DELETE, function: destroy
app.delete("/:id", (req,res) => {
    let param = {
        id_detail : req.params.id
    }
    detail.destroy({where: param})
        .then(result => {
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