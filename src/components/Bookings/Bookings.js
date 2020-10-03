import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loggedInUser] = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:5000/bookings?email='+ loggedInUser.email,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }

        })
        .then(res => res.json())
        .then(data => setBookings(data));
    }, [loggedInUser.email])
    return (
        <div>
            <h3> You have {bookings.length} bookings!!</h3>
            {
                bookings.map((book, idx) => <li key={idx}>Name: {book.name} Check In : {(new Date(book.checkInDate)).toDateString('dd/mm/yyyy')} Check Out : {book.checkOutDate}</li>)
            }
        </div>
    );
};

export default Bookings;