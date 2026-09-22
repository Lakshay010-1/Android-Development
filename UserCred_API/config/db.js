import mssql from "mssql";
import "dotenv/config";

const required_env = [ "DB_SERVER","DB_PORT","DB_NAME","DB_PASSWORD","DB_USER" ];

for(const field of required_env){
    if(!process.env[field]){
        throw new Error(`Missing environment variables: ${field}`);
    }
}

const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:30000
    },
    options: {
        encrypt: process.env.DB_ENCRYPT==="true",
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE==="true"
    }
};

const poolPromise = new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Database connected");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed: ",err);
        throw err;
    });

export {
    mssql, poolPromise
}