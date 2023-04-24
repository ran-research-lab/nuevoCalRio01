import { createContext, useState, useEffect } from "react";
import { database } from "../../db";

export const StoreContext = createContext({
    dateData: [],
    addDateData: (id) => {}, 
    removeDateData: (id) => {},
    select: (db) => {}
});

const StoreContextProvider = ({children}) => {
    const [dateDataState, setDateDataState] = useState(null);

    useEffect(() => {
        setInitialData()
    }, [] )

    const setInitialData = () =>  {
        // console.log("Setting initial data fom Context....");
        // return database.select(dateDataState)
    }

    addDateData = (id) => {
        console.log("In context adding the data: "  + JSON.stringify(id));
        if (dateDataState == null)
            setDateDataState(id);
        else {
            var res = [];
            for (let i = 0; i < dateDataState.length; i++) {
              if (dateDataState[i].theDate == id.theDate) res.push(i);
            }
            console.log("foound at: " + JSON.stringify(res));
            if (res.length > 0) {
                // tmp = dateDataState;
                // tmp[res[0]] = id;
                // setDateDataState(tmp);
                // setDateDataState((current) => current.filter(e => e.theDate !== id.theDate) + id );
                setDateDataState((current) => current.filter(e => e.theDate !== id.theDate) );

            }
            setDateDataState((current) => [...current, id] );
        }
    }

    removeDateData = (id) => {
        setDateDataState((current) => current.filter(e => e !== id) );
    }

    select = (db) => {
        console.log("Doing the context select!!!!!!!!");
    }

    const value  = {
        dateData: dateDataState,
        addDateData: addDateData,
        removeDateData: removeDateData,
        select: select
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default StoreContextProvider;