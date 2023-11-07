//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

const {Op} = require('sequelize');
const sequelize = require('sequelize');
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
    })
    res.json(result)
})

app.get("/tutorial/:id_tutorial", async (req, res) => {
    let param = {id_tutorial: req.params.id_tutorial}
    let result = await detail.findAll({
        where: param,
        order: [
            [ sequelize.cast(sequelize.col('urutan'), 'BIGINT') , 'ASC' ]
        ],
        include: [
            "tutorial"
        ]
    })
    res.json(result)
});

app.get("/:id", async (req, res) => {
    let result = await getDetailById(req.params.id) 
    res.json(result)
});

//endpoint untuk menyimpan data detail, METHOD: POST, function: create
app.post("/", async (req,res) => {
    let dataBody = req.body;
    if (dataBody instanceof Array) {
    for (let index = 0; index < dataBody.length; index++) {
        const element = dataBody[index];

        // get latest tutorial
        let nextUrutan = 1;
        let latestTutorial = await getLatestUrutanById(element.id_tutorial)
        if (latestTutorial) {
            nextUrutan = parseInt(latestTutorial.urutan) + 1;    
        } 

        let data = {
            id_tutorial: element.id_tutorial,
            urutan : nextUrutan,
            deskripsi : element.deskripsi,
            picture : element.picture,
            video : element.video,
            createdBy : req.query.user_id,
            createdAt : new Date,
            updatedAt : new Date
        }
        if(dataBody.length==1){
            detail.create(data)
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
            detail.create(data)
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

//endpoint mengupdate data detail, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id : req.params.id
    }
    let data = {
        urutan : req.body.urutan,
        deskripsi : req.body.deskripsi,
        picture : req.body.picture,
        video : req.body.video,
        updatedBy : req.query.user_id,

    }
    detail.update(data, {where: param})
        .then(() => {
            res.json(data)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data detail, METHOD: DELETE, function: destroy
app.delete("/:id", async (req,res) => {
    let id = req.params.id
    let param = {
        id : id
    }
    let dataDetail = await getDetailById(id)

    // ubah urutan
    await updateUrutan(dataDetail.id_tutorial, id)
    await detail.destroy({where: param})
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

async function getLatestUrutanById(idTutorial)
{
    let latestTutorial = null
    await detail
        .findOne({ 
            where: {id_tutorial: idTutorial},
            order: [
                [sequelize.cast(sequelize.col('urutan'), 'BIGINT') , 'DESC' ]
            ]
        }).then((result) => {
            latestTutorial = result
        })
        .catch((error) => {
            console.log(error)
        });
    
    return latestTutorial
}

async function getDetailById(id)
{
    let data = null
    await detail
        .findOne({ where: { id: id } })
        .then((result) => {
            data = result
        })
        .catch((error) => {
            console.log(error)
        });
    return data;
}

async function updateUrutan(idTutorial, idDetail)
{
    let dataAnotherDetail = null
    await detail
    .findAll({
        where: {
            id_tutorial: idTutorial,
            id: {
                [Op.gt]: idDetail
            }
        }
    }).then((result) => {
        dataAnotherDetail = result
    })
    .catch((error) => {
        console.log(error)
    });

    dataAnotherDetail.forEach(async element => {
        let detail = await getDetailById(element.id)
        // update
        detail.update({
            urutan: parseInt(detail.urutan) - 1
        }, {
            where: {id: element.id}
        })
        .then(() => {
        })
        .catch(error => {
            console.log(error)
        })
    });

    return true;
}

module.exports = app