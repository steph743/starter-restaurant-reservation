import { useHistory } from "react-router";

export default function ReservationForm({reservation, errors, handleSubmit, handleChange}){
    
    const history = useHistory();
    const errorDisplay = `Resolve these issues: ${errors.messages.join(',\n ')} !`;

    return (<>
<form>
            {errors.messages.length ? <div className="alert alert-danger" role="alert">
                {errorDisplay}</div> : <div></div>}
            <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name:</label>
                <input type="text" className="form-control" name="first_name" id="first_name" placeholder="First Name" value={reservation?.first_name} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name:</label>
                <input type="text" className="form-control" name="last_name" id="last_name" placeholder="Last Name" value={reservation?.last_name} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="mobile_number" className="form-label">Mobile Number:</label>
                <input type="tel" className="form-control" name="mobile_number" id="mobile_number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="xxx-xxx-xxxx" value={reservation?.mobile_number} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="reservation_date" className="form-label">Date of reservation:</label>
                <input type="date" className="form-control" name="reservation_date" id="reservation_date" placeholder="Date of Reservation" value={reservation?.reservation_date} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="reservation_time" className="form-label">Time of reservation:</label>
                <input type="time" className="form-control" name="reservation_time" id="reservation_time" placeholder="Time of Reservation" value={reservation?.reservation_time} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="people" className="form-label">Number of people:</label>
                <input type="number" min="1" pattern="\d+" className="form-control" name="people" id="people" placeholder='10' value={reservation?.people} onChange={handleChange} />
            </div>
            <button onClick={() => history.goBack()} type="cancel" className="buttonSpace btn btn-secondary">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary m-2">Submit</button>
        </form>
        </>)
};