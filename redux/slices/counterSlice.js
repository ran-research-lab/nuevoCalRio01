import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
   name: 'counter',
   initialState: {
      registered: false,
      users: [
         { id: 1, name: 'John' },
         { id: 2, name: 'Jane' },
         { id: 3, name: 'Bob' }
      ],
      dateData: {'2023-03-28':{'text':'una entrada el 4', 'mood': 'indigo'}},
      value: 42,
      otraCosa: []
   },
   reducers: {
      increaseByOne: (state,action) => {
         state.value++;
         // state.otraCosa.push('9');
         // state.dates.push(action.payload.theDate);
         state.dateData[action.payload.theDate] = {'text':action.payload.text, 'mood': 'indigo'};
         console.log("STATE DATA:" + JSON.stringify(state.dateData));
      },
      decreaseByOne: (state, action ) => {
         state.value--;
         // state.otraCosa.splice(state.otraCosa.indexOf(action.payload.id),1);
      },
      register: (state, actiion) => {
         state.registered = true;
         console.log("REGISTERING!!!! =============================================");
      }
   },
});

export const { increaseByOne, decreaseByOne, register } = counterSlice.actions;

export default counterSlice.reducer;