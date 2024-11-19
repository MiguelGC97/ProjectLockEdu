const db = require("../models");
const Report = db.report;
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op, AccessDeniedError } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//exports.getByUsername hacer un join para poder tomar la información de users

exports.findone = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Report.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Report with id = ${id} not found`,
      });
    }
  } catch {
    res.status(500).send({
      message: `Error retrieving Report with id= ${id}`,
    });
  }
};

exports.createReport = async (req, res) => {
  try {
    const newReport = await Report.create(report);

    const token = utils.generateToken(newReport);
    const reportObj = utils.getCleanUser(newReport);
    return res.json({ user: reportObj, access_token: token });
  } catch {
    err;
  }
  res.status(500).send({
    message: err.message || "Some error occurred while creating the Report.",
  });
};


exports.resolveReport = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Report.update((req.isSolved = true), {
      where: { id },
    });

    if (updated) {
      res.status(200).json({
        message: "Report resolved",
      });
    } else {
      res.status(404).json({
        message: "The report you are trying to update can't be found",
      });
    }
  } catch {
    err;
  }
  {
    res.status(500).json({ err: error.message });
  }
};

exports.updateDescription = async (req, res) => {
    try {
      const id = req.params.id;
      const timePassed =res.params.createdAt;
      
        //Split time passed

        let date = [

            {year: 0, month: 0 , day: 0,hour: 0,min: 0}
        ]

        let months = [
            {month: '01', name:'January', days:31},
            {month:'02', name:'February', days:28},
            {month:'03', name:'March', days:31},
            {month:'04', name:'April', days:30},
            {month:'05', name:'May', days:31},
            {month:'06', name:'June', days:30},
            {month:'07', name:'July', days:31},
            {month:'08', name:'August', days:31},
            {month:'09', name:'September', days:30},
            {month:'10', name:'October', days:31},
            {month:'11', name:'November', days:30},
            {month:'12', name:'December', days:31},
            ]
            

           function manyDays(date){

                let days = 0;
                for (let i = 0; i < months.length; i++) {
                    
                    if(months[i].month == date.month){

                         days = months[i].days;
                    }
                }
                    return days;
            }
            
            function limitTime(date){
                let days = manyDays(date);

                if(date.min >= 50){
                    //52%10==2
                    date.min == (data.min%10);

                }

                if(date.hour == 23 && date.min <= 50){
                    date.hour == '00';
                    date.min == '00';
                }

                //comprobar el dia para ver si esta a final de mes o no
                if (days)
            }
            

            function updatePermited{}

            }catch{


            }
};
