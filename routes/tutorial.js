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
app.get("/", (req,res) => {
    tutorial.findAll()
        .then(result => {
            res.json({
                tutorial : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id_tutorial", (req, res) => {
    tutorial
    .findOne({ where: { id_tutorial: req.params.id_tutorial } })
    .then((result) => {
        res.json({
            tutorial:result,
        });
    })
    .catch((error) => {
        res.json({
            message: error.message,
        });
    });
});

//endpoint untuk menyimpan data tutorial, METHOD: POST, function: create
app.post("/", (req,res) => {
    let dataBody = req.body;
    for (let index = 0; index < dataBody.length; index++) {
        const element = dataBody[index];
        
        // let arrayPicture = [];
        // if (element.picture1 != "") {
        //     arrayPicture.push(element.picture1);
        // }

        // if (element.picture2 != "") {
        //     arrayPicture.push(element.picture2);
        // }

        // if (element.picture3 != "") {
        //     arrayPicture.push(element.picture3);
        // }

        let data = {
            name : element.name,
            // picture1 : element.picture1,
            // picture2 : element.picture2,
            // picture3 : element.picture3,
            picture : JSON.stringify(element.picture),
            detail : element.detail,
            createdBy : req.query.user_id,
            status : element.status,
            category : element.category,
            createdAt : new Date,
            updatedAt : new Date
        }
    
        tutorial.create(data)
            .catch(error => {
                console.log(error);
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

//endpoint mengupdate data tutorial, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id_tutorial : req.params.id
    }
    let data = {
        updatedBy : req.query.user_id,
        status : req.body.status,
    }
    tutorial.update(data, {where: param})
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

//endpoint menghapus data tutorial, METHOD: DELETE, function: destroy
app.delete("/:id", (req,res) => {
    let param = {
        id_tutorial : req.params.id
    }
    tutorial.destroy({where: param})
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