import React, { useState} from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory} from "react-router-dom";
import {createReservation} from "../utils/api";
import { validateReservation } from "../utils/validations";
import ReservationForm from "./reservationForm";

export default function CreateReservation(){
    const [currentReservation, setCurrentReservation] = useState({});
    const [reservationError, setReservationError] = useState(null)
    const [errors, setErrors] = useState({"messages":[]});
    const history = useHistory();

    const handleChange = (event) => {
        setErrors({"messages": [] });
        const { name, value } = event.target;
        setCurrentReservation({...currentReservation, [name]: value});
    };

    const handleSubmit = async (event) => {
        const abortController = new AbortController();
        event.preventDefault();
        const validated = validateReservation(currentReservation, errors);

        if(!validated){
            setErrors({...errors})
            return errors.messages;
        };
        const reservation = {
            ...currentReservation,
            people: Number(currentReservation.people),
        };

        await createReservation({data: reservation}, abortController.signal)
            .then(() => history.replace(`/dashboard?date=${reservation.reservation_date}`))
            .catch(setReservationError)

        return () => abortController.abort();
    };

    return ( <>
         <div className="nav-custom container p-3 my-2 text-white">
            <div className="nav-custom row m-5 justify-content-center">
                <div className="col-4.5 p-3">
                    <h1 className="m-3">Create a Reservation</h1>
                </div>
            </div>   
        </div>
        <div className="container p-3 my-2">   
            <ErrorAlert error={reservationError}/> 
            <ReservationForm reservation={currentReservation} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange}/>
        </div>
        </>);
};