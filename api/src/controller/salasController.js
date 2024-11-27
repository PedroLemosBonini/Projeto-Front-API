const connect = require("../db/connect");
module.exports = class salasController {
  static async createSala(req, res) {
    const { numero_da_sala, capacidade, tipo_de_sala, status } = req.body;

    if (!numero_da_sala || !capacidade || !tipo_de_sala || !status) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    else if (numero_da_sala.length > 3) {
      return res.status(400).json({
        error: "Número de sala inválido. Deve conter 3 digítos ou menos",
      });
    } else {
      // Construção da query
      const query = `INSERT INTO salas (numero_da_sala, capacidade, tipo_de_sala, status) VALUES('${numero_da_sala}', '${capacidade}', '${tipo_de_sala}', '${status}')`;

      // Executando a query criada
      try {
        connect.query(query, function (err, results) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code == "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "A sala já existe" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Sala criada com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
  static async getAllSalas(req, res) {
    const query = `SELECT * FROM salas`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de salas", salas: results });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async updateSala(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, numero_da_sala, capacidade, tipo_de_sala, status } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!id || !numero_da_sala || !capacidade || !tipo_de_sala || !status) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos." });
    } // Check se o status não é feito de números ou não tem 11 digitos
    const query = `UPDATE salas SET numero_da_sala=?, capacidade=?, tipo_de_sala=?, status=? WHERE id_sala = ?`
    const values = [numero_da_sala, capacidade, tipo_de_sala, status, id]

    try{
      connect.query(query,values,function(err, results){
        if(err){
          if(err.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error: 'A sala já existe'})
          }
          else{
            console.error(err)
            return res.status(500).json({error: "Erro interno do servidor"})
          }
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Sala não encontrada"})
        }
        return res.status(200).json({message: "Sala atualizada com sucesso"})
      })
    }
    catch(error){
      console.error("Erro ao executar consulta",error)
      return res.status(500).json({message: "Erro interno do servidor"})
    }
  }

  static async deleteSala(req, res) {
    const salaId = req.params.id
    const query = 'DELETE FROM salas where id_sala = ?';
    const values = [salaId]

    try{
      connect.query(query,values,function(err, results){
        if(err){
          console.error(err)
          return res.status(500).json({error: "Erro interno do servidor"})
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Sala não encontrada"})
        }
        return res.status(200).json({message: "Sala excluída com sucesso"})
      })
    }
    catch(error){
      console.error(error)
      return res.status(500).json({error: "Erro interno do servidor"})
    }
  }
};
