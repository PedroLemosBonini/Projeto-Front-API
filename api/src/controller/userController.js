const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      //Verifica se tem só números e se tem 11 dígitos
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else {
      // Construção da query
      const query = `INSERT INTO usuario (nome, email, senha, telefone) VALUES('${nome}', '${email.toLowerCase()}', '${senha}', '${telefone}')`;

      // Executando a query criada
      try {
        connect.query(query, function (err, results) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code == "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O email já está vinculado a outro usuário" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }

      // Cria e adiciona novo usuário
    }
  }

  static async loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Os campos devem ser preenchidos" });
    }

    const query = `SELECT * FROM usuario WHERE email=? AND senha=?`;
    const values = [email, senha];

    try {
      connect.query(query, values, function (err, results) {
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Login bem-sucedido!" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de usuários", users: results });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, nome, email, senha, telefone } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!id || !nome || !email || !senha || !telefone) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos." });
    } // Check se o telefone não é feito de números ou não tem 11 digitos
    const query = `UPDATE usuario SET nome=?, email=?, senha=?, telefone=? WHERE id_usuario = ?`
    const values = [nome, email, senha, telefone, id]

    try{
      connect.query(query,values,function(err, results){
        if(err){
          if(err.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error: 'Email já cadastrado por outro usuario'})
          }
          else{
            console.error(err)
            return res.status(500).json({error: "Erro interno do servidor"})
          }
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Usuario não encontrado"})
        }
        return res.status(200).json({message: "Usuario atualizado com sucesso"})
      })
    }
    catch(error){
      console.error("Erro ao executar consulta",error)
      return res.status(500).json({message: "Erro interno do servidor"})
    }
  }

  static async deleteUser(req, res) {
    const usuarioId = req.params.id
    const query = 'DELETE FROM usuario where id_usuario = ?';
    const values = [usuarioId]

    try{
      connect.query(query,values,function(err, results){
        if(err){
          console.error(err)
          return res.status(500).json({error: "Erro interno do servidor"})
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Usuario não encontrado"})
        }
        return res.status(200).json({message: "Usuario excluído com sucesso"})
      })
    }
    catch(error){
      console.error(error)
      return res.status(500).json({error: "Erro interno do servidor"})
    }
  }
};
