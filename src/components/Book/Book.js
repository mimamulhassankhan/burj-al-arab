import DateFnsUtils from '@date-io/date-fns';
import { PrimaryButton } from '@fluentui/react';
import { Container, Grid } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import Bookings from '../Bookings/Bookings';

const Book = () => {
    const [loggedInUser] = useContext(UserContext);
    const [selectedDate, setSelectedDate] = useState({
        checkInDate : new Date(),
        checkOutDate : new Date()
    })

    const handleCheckIn = date => {
        const newDates = {...selectedDate};
        newDates.checkInDate = date;
        setSelectedDate(newDates);
    }

    const handleCheckOut = date => {
        const newDates = {...selectedDate};
        newDates.checkOutDate = date;
        setSelectedDate(newDates);
    }

    const handleBooking = () => {
        const newBookings = {...loggedInUser, ...selectedDate};
        fetch('http://localhost:5000/addBookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newBookings)
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }

    const {bedType} = useParams();
    return (
        <Container>
            <div style={{textAlign: 'center'}}>
                <h1>Hi, {loggedInUser.name}! Let's book a {bedType} Room.</h1>
                <p>Want a <Link to="/home">different room?</Link> </p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            margin="normal"
                            label="Check In"
                            value={selectedDate.checkInDate}
                            onChange={handleCheckIn}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            margin="normal"
                            label="Check Out"
                            format="dd/MM/yyyy"
                            value={selectedDate.checkOutDate}
                            onChange={handleCheckOut}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
                <PrimaryButton onClick={handleBooking} text="Book Now" />
                <br/>
                <Bookings/>
            </div>
        </Container>
    );
};

export default Book;