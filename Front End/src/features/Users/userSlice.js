import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';


export const createUser = createAsyncThunk(
    'user/createUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/users/createUser', formData);
            return response.data;  // Assuming response.data contains the token
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('An error occurred');
        }
    }
);

const tokenDecode = (token) => {
    try {
        const decoded = jwtDecode(token); // Decode the token using jwtDecode
        const expTime = new Date(decoded.exp * 1000); // Convert expiration time to date
        if (new Date() > expTime) {
            return null; // If token has expired, return null
        }
        return decoded; // Return the decoded token
    } catch (error) {
        return null; // If decoding fails, return null
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isLoading: false,
        error: null,
        authenticate: false,
        myInfo: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;

                // Assuming action.payload.token contains the token
                const decodedToken = tokenDecode(action.payload.token);
                if (decodedToken) {
                    state.myInfo = decodedToken;
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;
