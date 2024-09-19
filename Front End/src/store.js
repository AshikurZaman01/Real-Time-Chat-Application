import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/Users/userSlice";

const store = configureStore({

    reducer: {
        user: userReducer,
    }

})

export default store;