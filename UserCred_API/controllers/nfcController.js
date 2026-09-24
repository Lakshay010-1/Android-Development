import { mssql, poolPromise } from "../config/db.js";

const readNfcTag = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "missing required fields", data: null });
    }
    try {
        const pool = await poolPromise;
        const response = await pool.request().input("id", mssql.VarChar, id).query("SELECT * FROM user_credentials WHERE entryPass=@id");
        return res.status(200).json({ message: "Successfully fetched tag", data: response.recordset[0] });
    } catch (error) {
        return res.status(500).json({ message: "Error reading nfc : " + error.message, data: null })
    }
};

const readNfcUsers = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "missing required fields", data: null });
    }
    try {
        const pool = await poolPromise;
        const response = await pool.request().input("id", mssql.VarChar, id).query("SELECT * FROM user_credentials WHERE entryPass=@id");
        return res.status(200).json({ message: "Successfully fetched tag", data: response.recordset });
    } catch (error) {
        return res.status(500).json({ message: "Error reading nfc : " + error.message, data: null })
    }
}

export {
    readNfcTag,
    readNfcUsers
}