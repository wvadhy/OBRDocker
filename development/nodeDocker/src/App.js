import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [data, setData] = useState([{}]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetch("/getall")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setUsers(data);
                }
            }
        );
    }, []);

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

    const handleAddUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitNewUser = () => {
        console.log("Submitted user:", newUser);
        setShowAddModal(false);
        setNewUser({ name: '', email: '', password: '' });
        // Optionally post to server
    };

    return (
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
                            value={newUser.name}
                            onChange={handleAddUserChange}
                            className="modal-input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={handleAddUserChange}
                            className="modal-input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={handleAddUserChange}
                            className="modal-input"
                        />

                        <button className="submit-btn" onClick={handleSubmitNewUser}>Submit</button>
                    </div>
                </div>
             )}
        </div>
    );
}

export default App;
