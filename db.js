import * as SQLite from "expo-sqlite";
import { globalFuncs } from "./globalFuncs";
import React, {useState, useEffect, useContext} from 'react';
import {StoreContext} from './store/context/store';

const diaryTableName = "diario";



const openDatabase = () => {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }

    const db = SQLite.openDatabase("db50.db");
    return db;
}

export const db = openDatabase();


const dropTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "drop table if exists " + diaryTableName + ";" , [],
        (txObj, resultSet) => console.log("ok, dropped the table."),
        (txObj, error) => console.log('Error', error)
      );
    });
}

const createTable = (successFunc) => {
    console.log("\tin db....");
    db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists " + diaryTableName + " (id integer primary key not null,  theDate DATE, done int, value text);", 
            [],
            (txObj, resultSet) => successFunc(),
            (txObj, error) => console.log('Error', error)
        );
    });
};




const setupDatabaseAsync = async () => {
    console.log("setupDatabaseAsync");
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
            "create table if not exists " + diaryTableName + " (id integer primary key not null,  theDate DATE, done int, value text);", 
          );
        },
        (_, error) => { console.log("db error creating tables"); console.log(error); reject(error) },
        (_, success) => { resolve(success); console.log("\tsuccess creating tables");}
      )
    })
  }

  const insertDate = (date, successFunc) => {
    db.transaction( tx => {
        tx.executeSql( 'insert into ' + diaryTableName + ' (theDate) values ("2022-01-01")', [] );
      },
      (t, error) => { console.log("db error insertUser"); console.log(error);},
      (t, success) => { console.log("\tinserted the sample date") }
    )
  }

  const getUsers = (setUserFunc) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from ' + diaryTableName,
          [],
          (_, { rows: { _array } }) => {
            // setUserFunc(_array)
            console.log(JSON.stringify(_array));
            setUserFunc(_array);
          }
        );
      },
      (t, error) => { console.log("db error load users"); console.log(error) },
      (_t, _success) => { console.log("loaded users")}
    );
  }

const diaryEntry = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};


const select = (successFunc) => {
    db.transaction((tx) => {
        tx.executeSql("select theDate from " + diaryTableName + ";", [], (_, { rows }) => {
        console.log("the existing rows:" + JSON.stringify(rows['_array']));
        tmp = {    '2023-03-25': {dots: [diaryEntry, massage, workout], marked: true, selected: true, moodEmoji: 'algo'},
        '2023-03-26': {dots: [massage, workout], disabled: true}};
        // tmp = {}
        rows['_array'].forEach((e) => {
            console.log(e.theDate);
            tmp[globalFuncs.formatDate(e.theDate)] = {selected: false, marked: true, dots: [diaryEntry], moodEmoji: 'otro'};
        });
        console.log("tmp" + tmp);
        successFunc(tmp);

        },
        (txObj, error) => console.log('Error', error)
    );
    });
}


const newAdd = (text, date, dateString) => {
    if (text === null || text === "") {return false;}
    console.log("newAdd for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("insert into " +  diaryTableName + " (done, value, theDate) values (0, ?, ?)", [text,dateString],
        (txObj, resultSet) => { 
          console.log("\t ===(ADD)====> ok, inserted into the table for date: " + date);
        },
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };


const add = (text, date, dateString) => {
    const dateDataCtx = useContext(StoreContext); 
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    console.log("inserting for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("insert into " +  diaryTableName + " (done, value, theDate) values (0, ?, ?)", [text,date],
        (txObj, resultSet) => { 
          console.log("\t ===(ADD)====> ok, inserted into the table for date: " + date);
 
          setMarkedDates({...markedDates, [dateString]: {selected: true, marked: true, moodEmoji: 'otro'}});
          dateDataCtx.addDateData(dateString);

        },
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const update = (text, date, dateString) => {

    console.log("UPDATNG for date: " + dateString);
    db.transaction(
      (tx) => {
        tx.executeSql("update " +  diaryTableName + " set value = ? where theDate = ? ", [text,dateString],
        (txObj, resultSet) => console.log("ok, Updated the table"),
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };



  //DELETE FROM table_name WHERE condition;

  const remove = (date, dateString) => {

    console.log("DELETE for date: " + date);

    
    db.transaction(
      (tx) => {
        tx.executeSql("delete from " +  diaryTableName + " where theDate = ? ", [date],
        (txObj, resultSet) => { 
          console.log("ok, Removed...");
          const { [dateString]: omittedKey, ...newState } = markedDates;
          setMarkedDates(newState);

        },
        (txObj, error) => console.log('Error', error));

        tx.executeSql("select * from " + diaryTableName + ";", [], (_, { rows }) =>
          console.log(JSON.stringify(rows)),
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const addOrUpdate = (text, date, dateString) => {
    console.log("inserting or updatng for date: " + dateString);

    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [dateString], (_, { rows }) =>
          { console.log('has rows: ' + rows.length); 
            if (rows.length == 0) { 
              console.log("\t\tCalling add: " + text + " " + dateString);
              newAdd(text, date,dateString);
            }
            else {
                console.log("will update");
              //if (text.length > 0) 
              update(text, date, dateString);
              //else remove(date, dateString);
            }
          } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const selectDiaryEntry = (date, setText, dateString) => {
    // is text empty?

    console.log("getting for date: " + dateString);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [dateString], (_, { rows }) =>
          { console.log(rows.length); if (rows.length > 0) setText(rows['_array'][0]['value']);  } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };

  const anyRows = (date) => {
    // is text empty?

    console.log("getting for date: " + date);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from " + diaryTableName + " where theDate = ?;", [date], (_, { rows }) =>
          { console.log('has rows: ' + rows.length); return (rows.length > 0)  } ,
          (txObj, error) => console.log('Error', error)
        );
      },
      null,
      null // forceUpdate
    );
  };





export const database = {
    createTable,
    select,
    add,
    update,
    addOrUpdate,
    selectDiaryEntry,
    anyRows,
    remove,
    setupDatabaseAsync,
    insertDate,
    getUsers,
    newAdd,
    dropTable
}