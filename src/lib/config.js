let key = {};

let Envname = "live";
if (Envname == "live") {
  key = {
    logger: true,
    API_URL: `https://rep-doctor-backend.onrender.com/`,
    socket_URL: `https://rep-doctor-backend.onrender.com/`,
    front_URL: "https://akc-qr-frontend-a02ffbe34861.herokuapp.com/",
    CRYPTO_SECRET_KEY: "PvGP1RnFjraCQ5kSARANZ5Qdq3jhw0Imq"
  };
} else {
  key = {
    logger: true,
    API_URL: `http://192.168.29.200:4000`,
    socket_URL: `http://192.168.29.200:4000`,
    front_URL: "http://localhost:5173",
    CRYPTO_SECRET_KEY: "PvGP1RnFjraCQ5kSARANZ5Qdq3jhw0Imq"
  };
}


export default key;
