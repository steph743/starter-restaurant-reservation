
const knex = require("../db/connection");

function list(){
    return knex("reservations")
        .select("*")    
};

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`)
      .orderBy("reservation_date");
};

function create(reservation){
    return knex("reservations")
        .insert(reservation,"*")
        .then((updatedRecords) => updatedRecords[0]);
};

function read(reservation_id){
    return knex("reservations")
        .select("reservations.*")
        .where({"reservation_id": reservation_id})
        .first();
};

function readDate(date){
    return knex("reservations")
        .whereNot({"status": "finished"})
        .whereNot({"status": "cancelled"})
        .orderBy('reservation_time')
        .distinct("reservations.*")
        .where({"reservation_date": date})
};

function resTaken(date, time){
    return knex("reservations")
        .orderBy('reservation_time')
        .distinct("reservations.*")
        .where({"reservation_date": date, "reservation_time": time});
};

function statusUpdate(reservation_id, status){
    return knex("reservations")
        .where({ "reservation_id": reservation_id })
        .update({ "status": status })
        .returning("status")
};

function reservationUpdate(updatedReservation){
    return knex("reservations")
        .where({"reservation_id": updatedReservation.reservation_id})
        .update(updatedReservation)
        .returning("*")
};

    module.exports = {
    list,
    create,
    read,
    readDate,
    resTaken,
    search,
    statusUpdate,
    reservationUpdate,
};