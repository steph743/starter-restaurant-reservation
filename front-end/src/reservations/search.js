import React, {useState}  from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservationsView from "../dashboard/DashboardReservations";

export default function SearchReservation(){
    const [foundReservations, setFoundReservations] = useState([]);
    const [foundReservationError, setFoundReservationError] = useState(null);

    const [notFound, setNotFound] = useState(false);

    function handleChange({ target }) {
        setNotFound(false)
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFoundReservations([]);
        const mobile_number = document.getElementById('mobile_number').value
        const abortController = new AbortController();
        
        listReservations({mobile_number}, abortController.signal)
            .then((response) => {
                if(response.length){
                    setFoundReservations(response)
                } else setNotFound(true)
            })
            .catch(setFoundReservationError)

        return () => abortController.abort();
    };

    const NotFound = (<b>No reservations found</b>);
    
    return (
        <>
        <div className="container p-3 my-2 nav-custom text-white">
            <div className="row m-5 justify-content-center">
            <div className="col-4.5  p-3 nav-custom text-white">
                <h1 className="m-3">Search for a Reservation</h1>
            </div>
           
        </div>
            
        </div>
        <ErrorAlert error={foundReservationError} />
        <div className="container border border-primary bg-white text-white">
            <div className="row justify-content-center p-2">
                <div className="col-6">
                    <input type="text" className="form-control form-control" id='mobile_number' name="mobile_number" onChange={handleChange} placeholder="Enter a customer's phone number"/> 
                </div>
                <div className="col-2">
                    <button type="submit" onClick={handleSubmit} className="btn btn-outline-primary">Submit</button>
                </div>
            </div>
        </div>
        <div>
            <h6>
                {foundReservations.length? <DashboardReservationsView reservations={foundReservations}/>: null}
            </h6>
            {notFound? NotFound : null}
        </div>
        </>);
};