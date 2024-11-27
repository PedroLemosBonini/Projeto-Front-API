const connect = require("../db/connect");

module.exports = class reservaController {
  Reserva;
  // criação de um Reserva
  static async createReserva(req, res) {
    const { id_sala, id_usuario, data_inicio, data_fim } = req.body;

    if (!id_sala || !id_usuario || !data_inicio || !data_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    //query e values para validação
    const queryV = `SELECT * from reserva WHERE id_sala = ? AND (data_inicio < ? AND data_fim > ?)`;
    const values = [id_sala, data_fim, data_inicio];

    try {
      connect.query(queryV, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao reservar sala!" });
        } else if (results.length < 0) {
          return res.status(201).json({ message: "Sala já reservada!" });
        }
        if (data_inicio > data_fim) {
          return res.status(400).json({ error: "Selecione uma data válida" });
        }

        const query = `INSERT INTO reserva (data_inicio, data_fim, id_usuario, id_sala) VALUES (?,?,?,?)`;
        const novosvalores = [data_inicio, data_fim, id_usuario, id_sala];
        connect.query(query, novosvalores, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao reservar sala!" });
          }
          return res
            .status(201)
            .json({ message: "Sala reservada com sucesso" });
        });
      });
    } catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } // fim do 'createReserva'

  static async getAllReserva(req, res) {
    const query = `SELECT * FROM reserva`;
    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro a reservar sala" });
        }
        return res
          .status(200)
          .json({ message: "Reservas listadas com sucesso", reserva: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query: ", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }

  static async updateReserva(req, res) {
    const { id_sala, data_inicio, data_fim, id_reserva } = req.body;

    // Verifica se todos os parâmetros necessários foram enviados
    if (!data_inicio || !data_fim || !id_reserva || !id_sala) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Verifica se a sala está disponível para o novo horário
    const query = `SELECT * FROM reserva WHERE id_sala = ? AND (data_inicio < ? AND data_fim > ?) AND id_reserva != ?`;
    const values = [id_sala, data_fim, data_inicio, id_reserva];

    try {
      // Verificar se o horário está disponível
      connect.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ error: "Erro ao verificar disponibilidade!" });
        }
        if (data_inicio > data_fim) {
          return res.status(400).json({ error: "Selecione uma data válida" });
        }

        // Se não houver resultados, significa que o horário está disponível
        if (results.length > 0) {
          return res.status(400).json({ error: "Horário já reservado!" });
        }
        

        // Atualizar a reserva no banco de dados
        const updateQuery = `UPDATE reserva SET data_inicio = ?, data_fim = ? WHERE id_reserva = ?`;
        const updateValues = [data_inicio, data_fim, id_reserva];

        connect.query(updateQuery, updateValues, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Erro ao atualizar a reserva!" });
          }

          return res
            .status(201)
            .json({ message: "Reserva atualizada com sucesso!" });
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteReserva(req, res) {
    const reservaId = req.params.id;
    const query = `DELETE FROM reserva WHERE id_reserva = ?`;
    const values = [reservaId];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não Encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Reserva Excluido com Sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  } // fim do 'deleteReserva'

  static async getReservaPorData(req, res) {
    const query = `SELECT * FROM reserva`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar Reservas" });
        }
        const dataReserva = new Date(results[0].data_inicio);
        const dia = dataReserva.getDate();
        const mes = dataReserva.getMonth() + 1;
        const ano = dataReserva.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const now = new Date();
        const ReservasPassados = results.filter(
          (Reserva) => new Date(Reserva.data_inicio) < now
        );
        const ReservasFuturos = results.filter(
          (Reserva) => new Date(Reserva.data_inicio) >= now
        );

        const diferencaMs =
          ReservasFuturos[0].data_inicio.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const min = Math.floor(
          ((diferencaMs % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) /
            (1000 * 60)
        );
        const seg = Math.floor(
          (((diferencaMs % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) %
            (1000 * 60)) /
            1000
        );
        console.log(
          diferencaMs,
          "Faltam: " + dias + " dias",
          +horas,
          "horas",
          +min,
          "min",
          +seg,
          "seg"
        );

        //comparando datas
        const dataFiltro = new Date("2024-12-15").toISOString().split("T");
        const ReservasDia = results.filter(
          (Reserva) =>
            new Date(Reserva.data_inicio).toISOString().split("T")[0] ===
            dataFiltro[0]
        );
        console.log("Reservas:", ReservasDia);
        return res
          .status(200)
          .json({ message: "Reservas: ", ReservasFuturos, ReservasPassados });
      });
    } catch (error) {
      console.log("Erro ao executar a querry: ", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }
  static async getReservasPorData7Dias(req, res) {
    const dataFiltro = new Date(req.params.data).toISOString().split("T");
    const dataLimite = new Date(req.params.data);
    dataLimite.setDate(dataLimite.getDate() + 7);
    console.log("Data Fornecida:", dataFiltro);
    console.log("Data Limite:", dataLimite);
    const query = `SELECT * FROM Reserva`;
    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar Reservas" });
        }

        const ReservasSelecionados = results.filter(
          (Reserva) =>
            new Date(Reserva.data_inicio).toISOString().split("T")[0] >=
              dataFiltro[0] &&
            new Date(Reserva.data_inicio).toISOString().split("T")[0] <
              dataLimite.toISOString().split("T")[0]
        );

        console.log(ReservasSelecionados);

        return res
          .status(200)
          .json({ message: "Reservas: ", ReservasSelecionados });
      });
    } catch (error) {
      console.log("Erro ao executar a querry: ", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
    const dataReserva = new Date("2024-10-11T08:00:00Z");
    const dia = dataReserva.getDate();
    const mes = dataReserva.getMonth() + 1;
    const ano = dataReserva.getFullYear();

    console.log(`Reserva no dia: ${dia}, Mes: ${mes}, Ano: ${ano}`);
  }
};
