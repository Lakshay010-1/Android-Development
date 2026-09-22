import { mssql, poolPromise } from "../config/db.js";

const getUser = async (req, res) => {
    const { email } = req.params;
    try {
        const pool = await poolPromise;
        const response = await pool
            .request()
            .input("email", mssql.VarChar, email)
            .query("SELECT * FROM user_credentials WHERE userEmail=@email");
        if (response.recordset[0] == null) {
            return res.status(404).json({ message: "User not found", data: null })
        }
        const { userPassword, ...userData } = response.recordset[0];
        return res.status(200).json({ message: "User fetched successfully", data: userData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", data: null });
    }
};

const getUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const response = await pool
            .request()
            .query("SELECT userId, userName, userEmail FROM user_credentials");
        return res.status(200).json({ message: "Users fetched successfully", data: response.recordset });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user_credentials", data: null });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const pool = await poolPromise;
        const response = await pool
            .request()
            .input("id", mssql.Int, id)
            .input("name", mssql.VarChar, name)
            .input("email", mssql.VarChar, email)
            .query("UPDATE user_credentials SET userName=@name, userEmail=@email WHERE userId=@id");
        const rowsAffected = response.rowsAffected.length > 0;
        if (!rowsAffected) {
            return res.status(400).json({ message: "Error updating user", data: null });
        }
        return res.status(200).json({ message: "User updated successfully", data: rowsAffected });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", data: null });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const response = await pool
            .request()
            .input("id", mssql.Int, id)
            .query("DELETE FROM user_credentials WHERE userId=@id");
        const rowsAffected = response.rowsAffected.length > 0;
        if (!rowsAffected) {
            return res.status(400).json({ message: "Error deleting user", data: null });
        }
        return res.status(200).json({ message: "User deleted successfully", data: rowsAffected });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", data: null });
    }
};

export {
    getUser,
    getUsers,
    updateUser,
    deleteUser
};