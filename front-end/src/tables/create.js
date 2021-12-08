import React, { useState} from "react";
import {useHistory} from "react-router-dom";
import {createTable} from "../utils/api";



export default function CreateTable(){
    const history = useHistory();
    const [newTable, setNewTable] = useState({});
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewTable({...newTable, [name]: value});

    }

    const handleSubmit = async (event) => {
        const abortController = new AbortController();

        event.preventDefault();
        const table = {
                ...newTable,
                capacity: Number(newTable.capacity),
            };
        await createTable({data: table}, abortController.signal)
            .then(() => {history.replace(`/dashboard`)})
    
        return () => {
            abortController.abort();
        };
    };
    
    return (<>
      <div className="container p-3 my-2 nav-custom text-white">
            <div className="row m-5 justify-content-center">
            <div className="col-4.5  p-3 nav-custom text-white">
                <h1 className="m-3">Create a Table</h1>
            </div>
           </div>
        </div>
        <div className="container p-3 my-2">    
        <form>
            <div className="mb-3">
                <label for="table_name" className="form-label">Table Name:</label>
                <input type="text" className="form-control" name="table_name" id="table_name" placeholder="Table Name" value={newTable?.table_name} onChange={handleChange}/>
            </div>
            <div className="mb-3">
                <label for="capacity" className="form-label">Capacity of Table:</label>
                <input type="number" min="1" pattern="\d+" className="form-control" name="capacity" id="capacity" placeholder='10' value={newTable?.capacity} onChange={handleChange}/>
            </div>
            <button onClick={() => history.goBack()} type="button" className="buttonSpace btn btn-secondary">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
        </form>
        </div>
    </>
    )
}