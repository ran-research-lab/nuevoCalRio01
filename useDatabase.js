// force the state to clear with fast refresh in Expo
// @refresh reset
import React, {useState, useEffect, useContext} from 'react';

import {database} from './db'

import {StoreContext} from './store/context/store';
export default function useDatabaseLoader() {
  const [isDBLoadingComplete, setDBLoadingComplete] = useState(false);
  const [dateData, setDateData] = useState([]);

  const dateDataCtx = useContext(StoreContext); 
  useEffect(() => {
    async function loadDataAsync() {
      try {
        console.log("useDatabase: Calling create Table");
        // await database.createTable()
        // await database.dropTable();
        await database.setupDatabaseAsync()
        //await database.insertDate('2022-02-02')
        await database.getUsers(setDateData)
//         // await database.setupDatabaseAsync()
//         // await database.setupUsersAsync()

        setDBLoadingComplete(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadDataAsync();
  }, []);

  dateDataCtx.addDateData(dateData);
  console.log("date data in Use Database: " + dateData);
  return dateData;
  return isDBLoadingComplete;
}