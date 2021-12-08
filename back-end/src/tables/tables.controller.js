const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service")

{/*
  //########################################C.R.U.D.########################################//
                                        Functions bellow
*/}

async function list(req, res) {
    const data = await service.list();
    res.json({data});
};

async function create(req, res){
  let value;
  if(req.body.data.reservation_id){value = true}
  const data = await service.create({...req.body.data, occupied: value});
  res.status(201).json({ data });
};


async function seat(req, res, next){
  const table_id = req.params.table_id;
  const reservation_id = req.body.data.reservation_id;
  updated = await service.seatRes(table_id, reservation_id);

  res.status(200).json({updated});
};

async function unseat(req, res, next){
  const table = res.locals.table;
  const reservation_id = table.reservation_id;
  if(!table.occupied || !table.reservation_id) return next({status: 400, message: `table is not occupied`})
  
  updated = await service.unseat(table.table_id, reservation_id)

  res.status(200).json({updated});
};

{/*
  //########################################Validation########################################//
                                        Functions bellow
*/};

function hasName(req, res, next){
  const {data: {table_name} = {}} = req.body;
  if(table_name){
    res.locals.table_name = table_name;
    return next();
  };
  next({status: 400, message:"table_name is missing"});
};

function nameValid(req, res, next){
  const table = res.locals.table_name;
  if(table.length > 1){
    return next();
  };
  next({status: 400, message:"table_name is not valid"});
};

function hascapacity(req, res, next){
  const {data: {capacity} = {}} = req.body;
  if(capacity && Number.isInteger(capacity)){
    res.locals.capacity = capacity;
    return next();
  };
  next({status: 400, message:"capacity is missing"});
};

function hasReservId(req, res, next){
  const {data: {reservation_id} = {}} = req.body;
  //const reservation_id = req.params.reservation_id;
  if(!req.body.data || !reservation_id){return next({status: 400, message: "missing reservation_id or data"});
  };
  next();
};

async function validRes(req, res, next){
  const {data: {reservation_id} = {}} = req.body;
  const reservation = await reservationService.read(reservation_id);

  if(!reservation)return next({status: 404, message: `reservation ${reservation_id} not found`});
  if(reservation.status === "seated")return next({status: 400, message: `${reservation_id} already seated`,});
  
  res.locals.reservation = reservation;
  next();
};

async function tableExists(req, res, next){
  const {table_id} = req.params;
  const table = await service.read(Number(table_id));
  if(!table){ 
    return next({ status: 404, message: `Table ${table_id} cannot be found.` });
  };
  res.locals.table = table;
  next()
};

function hasCap(req, res, next){
  const people = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;

  if(capacity < people ){
    return next({status:400, message: "not enough capacity"});
  };
  next()
};

function isOccupied(req, res, next){
  const table = res.locals.table
  
  if(table.occupied === true){
    return next({status:400, message: "table is occupied"})
  };
  next();
};

module.exports = {
    list: [
      asyncErrorBoundary(list)
    ],

    create: [
      hasName,
      nameValid,
      hascapacity,
      asyncErrorBoundary(create)
    ],

    seat: [
      hasReservId,
      asyncErrorBoundary(validRes),
      asyncErrorBoundary(tableExists),
      hasCap,
      isOccupied,
      asyncErrorBoundary(seat),
    ],

    unseat: [
      asyncErrorBoundary(tableExists),
      asyncErrorBoundary(unseat),
    ],
};