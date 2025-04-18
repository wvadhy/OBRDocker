// -- Imports required for state changes
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

/* Ideally this app would be separated into its constituent working parts and
imported into this App.js file for compartmentalisation of functionality, though
as this is just a generic base for testing I've opted out of doing that for brevity.
*/

function App() {
    // -- Setting up state for rest modals and data such as userData
    const [data, setData] = useState([{}]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // -- Fetches all users from the obr MySQL database, used to populate table
    const fetchUsers = async () => {
            fetch("/get_all")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setUsers(data);
                }
            });
    };

    // -- Embedded within useEffect() to emulate jQuery refresh
    useEffect(() => {
        fetchUsers();
    }, []);

    // -- Get connection data from flask route
    useEffect(() => {
        fetch("/connect").then(
            res => res.json()
        ).then(
            data => {
                setData(data);
                console.log(data);
            }
        )
    }, []);

    // -- Basic form submission handler for adding new users
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowAddModal(false);

        // -- Prepare data to be sent to the flask route
        const formData = { name, email };

        try {
            const response = await fetch('/set', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // -- Await result of POST request
        const result = await response.json();
        console.log(result);
        } catch (error) {
        console.error('Error submitting form:', error);
        }
    };

    // -- Basic deletion handler for users, triggers whenever the bin button is pressed
    const handleDelete = async (id) => {
        try {
            const response = await fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            // -- Await result of POST request
            const result = await response.json();

            if (result.success) {
                console.log("User deleted!")
                fetchUsers();
            } else {
                console.error('Failed to delete user:', result.error);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    return (
        // Basic layout for a basic app, I'm not a frontend dev...
        <div className="obr">

            <button className="check-data" onClick={() => setShowModal(true)}>Connection data</button>

            <div className="search-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                />
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </button>
            </div>

            <div className="user-cells">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <div key={index} className="user-cell">
                            <div className="cell">{user.id}</div>
                            <div className="cell">{user.user_email}</div>
                            <div className="cell">{user.user_password_hash}</div>
                            <div className="cell">{user.last_activity}</div>

                            <button
                                onClick={() => handleDelete(user.id)}
                                className="delete-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M9 6v12M15 6v12M9 14h6" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Connection Information</h2>
                        <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        {(typeof data.components === 'undefined') ? (
                            <p>Awaiting connection...</p>
                        ) : (
                            data.components.map((user, i) => (
                                <p key={i}>{user}</p>
                            ))
                        )}
                    </div>
                </div>
            )}

             {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New User</h2>
                        <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="modal-input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="modal-input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="modal-input"
                        />

                        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
             )}
        </div>
    );
}

export default App;