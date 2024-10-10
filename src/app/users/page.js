//users page
import { useEffect, useState } from "react";
import { fetchUser } from "../utils/api";

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUser();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        getUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold">Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </li>
                ))}
            </ul>
        </div> 
    );
};

export default UsersPage;