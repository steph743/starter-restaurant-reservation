/**
 * List handler for reservation resources
 */


 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


{/*
  //########################################C.R.U.D.########################################//
                                        Functions bellow
*/}

async function list(req, res) {
  const {date, mobile_number} = req.query
  let data;
  if(date) data = await service.readDate(date); 
  else if(mobile_number) data = await service.search(mobile_number);
  else data = await service.list();
  //Sort them now

  res.json({data});
};

async function read(req, res){
  const data = await service.read(res.locals.reservation.reservation_id);
  
  res.json({data})
};

async function create(req, res){
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
};

async function update(req, res, next){
  const {reservation_id} = res.locals.reservation;
  const {status} = req.body.data;
  const data = await service.statusUpdate(reservation_id, status);

  res.status(200).json({ data: {
    status: data[0],}
  });
};

async function reservationUpdate(req, res, next){
  const updatedReservation = {
    ...req.body.data,
  };
  data = await service.reservationUpdate(updatedReservation);
  
  res.status(200).json({data: data[0]});
};
{/*
  //########################################Validation########################################//
                                        functions bellow
*/}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  };
  next({ status: 404, message: `reservation_id not found: ${reservation_id}` });
};

function checkStatus(req, res, next){
  const {data: {status} = {}} = req.body;
  if(status === 'seated') return next({status: 400, message:`status is seated`});
  if(status === 'finished') return next({status: 400, message:`status is finished`});
  next();
};

function hasFirstName(req, res, next){
  const {data: {first_name} = {}} = req.body;
  if(first_name){
      res.locals.first_name = first_name;
   return next();
  };
    next({status: 400, message: "first_name is missing"}); 
};

function hasLastName(req, res, next){
  const {data: {last_name} = {}} = req.body;
  if(last_name){
    res.locals.last_name = last_name;
    return next();
  };
  next({status: 400, message: "last_name is missing"});
};

function hasMobileNumber(req, res, next){
  const {data: {mobile_number} = {}} = req.body;
  if(mobile_number){
    res.locals.mobile_number = mobile_number;
    return next();
  };
  next({status: 400, message: "mobile_number is missing"});
};

function validDate(req, res, next){
  const {data: {reservation_date} = {}} = req.body;
  let valid = new Date(reservation_date)
  if(valid.toString() != 'Invalid Date'){
    return next();
  };
  next({status:400, message: "reservation_date is not valid"});
};

function hasReservationDate(req, res, next){
  const {data: {reservation_date} = {}} = req.body;
  if(reservation_date){
    const check = new Date(reservation_date)
    res.locals.reservation_date = reservation_date;
    return next();
  };
  next({status: 400, message:"reservation_date is missing"});
};

function hasReservationTime(req, res, next){
  const {data: {reservation_time} = {}} = req.body;
  if(!reservation_time){
    next({status: 400, message: "reservation_time is missing"});
  };
  var military = /^\s*([01]?\d|2[0-3]):[0-5]\d\s*$/i;
  var standard = /^\s*(0?\d|1[0-2]):[0-5]\d(\s+(AM|PM))?\s*$/i;
 
  if(reservation_time.match(military) || reservation_time.match(standard)){
    res.locals.reservation_time = reservation_time;

    return next();
  };
  next({status: 400, message: `reservation_time isn't valid ${reservation_time}`});
};

function hasPeople(req, res, next){
  const {data: {people} = {}} = req.body;
  if(people > 0 && people){
    res.locals.people = people;
    return next();
  };
  next({status: 400, message: "people quantity not valid"});
};

function peopleNan(req, res, next){
  const people = res.locals.people;
  if(typeof people === "number"){
   return next();
  };
  next({status: 400, message: "people is not a number lol"});
};

function notPast(req, res, next){ 
  const date = res.locals.reservation_date;
  const time = res.locals.reservation_time;

  
  const current = new Date();
  const dateString = new Date(`${date} ${time}`).toUTCString();
  const valid = new Date(dateString);

  if(current < valid){
    return next();
  };
  next({status:400, message: `reservation must be in the future `});
};


function notTues(req, res, next){ 
  let date = res.locals.reservation_date;
  let valid = new Date(date)
  if(valid.getDay() !== 1){
    
    return next();
  };
  next({status:400, message: "closed on Tuesdays"});
};

function validTime(req, res, next){
  const resTime = res.locals.reservation_time;
  if(resTime < "10:30"){
    return next({status: 400, message: "Pick a later time"});
  }
  else if(resTime > "21:30"){
    return next({status: 400, message: "Pick an earlier time"});
  };
  next()
};

async function resTaken(req, res, next){
  const resTime = res.locals.reservation_time;
  const resDate = res.locals.reservation_date;
  const taken = await service.resTaken(resDate, resTime);
  if(taken){
    return next();
  };
  next({status:400, message: "time taken"});
};

function resCheck(req, res, next){
  const reservation = res.locals.reservation;
  if(reservation.status === 'finished' || reservation.status === 'cancelled') return next({status:400, message: `a finished reservation cannot be updated`})
  next();
};

function statusCheck(req, res, next){
  const {status} = req.body.data;
  if(status !== 'finished' && status !== 'booked' && status !== 'seated' && status !== 'cancelled') return next({status:400, message: `unknown`})
  next();
};

module.exports = {
  list: [
    asyncErrorBoundary(list)
  ],
  create: [
    checkStatus,
    hasFirstName, 
    hasLastName, 
    hasMobileNumber, 
    hasReservationDate, 
    hasReservationTime, 
    hasPeople,
    peopleNan,
    validDate,
    notPast,
    notTues,
    validTime,
    resTaken,
    asyncErrorBoundary(create)
    ],
  changeStatus: [
    asyncErrorBoundary(reservationExists),
    resCheck,
    statusCheck,
    asyncErrorBoundary(update)
    ],  
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    validDate,
    hasReservationTime,
    hasPeople,
    peopleNan,
    asyncErrorBoundary(reservationUpdate)
  ], 
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
};