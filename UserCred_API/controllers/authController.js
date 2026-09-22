import bcrypt from "bcrypt";
import { mssql, poolPromise } from "../config/db.js";

const registerUser = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const pool = await poolPromise;
        const userExists = await pool.request().input("email", mssql.VarChar, email).query("SELECT * FROM user_credentials WHERE userEmail=@email");
        if (userExists.recordset.length > 0) {
            return res.status(400).json({ message: "User already exists", data: null });
        }
        const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_SALT));
        const registerUserOp = await pool.request()
            .input("email", mssql.VarChar, email)
            .input("name", mssql.VarChar, name)
            .input("password", mssql.VarChar, hashedPassword)
            .query("INSERT INTO user_credentials (userEmail, userName, userPassword) VALUES (@email, @name, @password)");
        if (registerUserOp.rowsAffected[0] > 0) {
            return res.status(201).json({ message: "User registered successfully", data: true });
        }
        return res.status(500).json({ message: "Error registering user", data: null });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", data: null });
    }
};

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const pool = await poolPromise;
        const userExists = await pool.request().input("id", mssql.Int, id).query("SELECT userPassword FROM user_credentials WHERE userId=@id");
        if (userExists.recordset.length == 0) {
            return res.status(404).json({ data: null, message: "User not found" });
        }
        const { userPassword } = userExists.recordset[0];
        const isPasswordCorrect = await bcrypt.compare(oldPassword, userPassword);
        if (isPasswordCorrect) {
            const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.HASH_SALT));
            const response = await pool.request()
                .input("id", mssql.VarChar, id)
                .input("password", mssql.VarChar, hashedPassword)
                .query("UPDATE user_credentials SET userPassword=@password WHERE userId=@id");
            if (response.rowsAffected.length == 0) {
                return res.status(400).json({ data: null, message: "Error updating password" });
            }
            return res.status(200).json({ message: "Update updated successfully", data: response.rowsAffected.length > 0 });
        } else {
            return res.status(401).json({ data: null, message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error updating password", data: null });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const userExists = await pool.request().input("email", mssql.VarChar, email).query("SELECT * FROM user_credentials WHERE userEmail=@email");
        if (userExists.recordset.length == 0) {
            return res.status(401).json({ message: "Invalid email or password", data: null });
        }
        const { userPassword, ...userData } = userExists.recordset[0];
        const isPasswordCorrect = await bcrypt.compare(password, userPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password", data: null });
        }
        return res.status(200).json({ message: "Verified User", data: userData });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying user", data: null });
    }
};

export {
    registerUser,
    loginUser,
    updatePassword
}