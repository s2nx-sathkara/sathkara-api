const { request } = require('express');
const { Query } = require('mongoose');
const Request = require('../models/requests.model');
const User = require('../models/users.model');
var ObjectId = require('mongodb').ObjectId;

//get all request
const getRequests = async(req,res)=>{
    const request = await Request.aggregate([
        {
        $lookup: {
            from: "users",
            localField: "uId",
            foreignField: "_id",
            as: "user",
        }
        },
        { 
            $unwind: '$user'
        },
        {
        $sort:{
                createdAt: -1 
        }
        }
    ]);

    res.status(200).json(request); 
}

// //get request by ID
// const getrequest = async(req,res)=>{
//     const {_id} = req.params

//     const request = await Request.find({_id})

//     if(!request){
//         return res.status(404).json({error:'request not found'})
//     }

//     res.status(200).json(request)
// }

//get request by ID
const getrequest = async(req,res)=>{
    const {_id} = req.params

        const request = await Request.aggregate([
            {
            $match: {
                _id: ObjectId(_id)},
            },
            {
            $lookup: {
                from: "users",
                localField: "uId",
                foreignField: "_id",
                as: "user",
            }
            },
            { 
                $unwind: '$user'
            }
        ]);
    res.status(200).json(request)
}

//get request by location
const getrequestbylocation = async(req,res)=>{
    const {rProvince,rDistrict} = req.params
        let loc = {};

        if(!rDistrict){
            loc = {rProvince}
        }
        else{
            loc = {rProvince,rDistrict}
        }

        const request = await Request.aggregate([
            {
            $match: loc
            },
            {
            $lookup: {
                from: "users",
                localField: "uId",
                foreignField: "_id",
                as: "user",
            }
            },
            { 
                $unwind: '$user'
            }
        ]);
        
    if(!request){
        return res.status(404).json({error:'request not found'})
    }
    res.status(200).json(request)
}

//create new request
const createRequest = async(req,res)=>{
    const {pharmaceutical, rCategory, rDescription, rExpDate, rProvince, rDistrict, rCity, rIsComplete, rUrgency, uId } = req.body;

    //add document to db
    try{
        const request = await Request.create({pharmaceutical, rCategory, rDescription, rExpDate, rProvince, rDistrict, rCity, rIsComplete, rUrgency, uId})
        res.status(200).json(request)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//update request by ID
const updateRequest = async(req,res)=>{
    const {_id} = req.params

    const request = await Request.findOneAndUpdate({_id},{
        ...req.body
    })

    if (!request){
        return res.status(404).json({error:'No such request'})
    }

    res.status(200).json(request)
}

//delete request by ID
const deleterequest = async(req,res)=>{
    const {_id} = req.params

    const request = await Request.findOneAndDelete({_id})

    if (!request){
        return res.status(400).json({error: 'No such request'})
    }

    res.status(200).json(request)
}

module.exports={
    getRequests,
    getrequest,
    getrequestbylocation,
    createRequest,
    updateRequest,
    deleterequest
}