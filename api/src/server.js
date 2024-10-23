//Importa a instância do Express configurada em index.js
const app = require("./index");
const cors = require('cors');

// Configuração do CORS com origens permitidas
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,HEAD,PATCH',
    credentials: true,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions));

//Inicia o servidor na porta 5000, tornando a API acessível em http://localhost:5000
app.listen(5000);
