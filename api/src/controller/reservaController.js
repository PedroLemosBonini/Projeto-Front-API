const connect = require("../db/connect");

module.exports = class reservaController { Reserva
  // criação de um Reserva
  static async createReserva(req, res) {
    const { id_sala, id_usuario, data_reserva } = req.body;

    if (!id_sala || !id_usuario || !data_reserva) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = ` INSERT INTO reserva (id_sala, id_usuario, data_reserva) VALUES (?,?,?)`;
    const values = [id_sala, id_usuario, data_reserva];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao reservar sala!" });
        }
        return res.status(201).json({ message: "Sala reservada com sucesso!" });
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
    const { id_sala, id_usuario, data_reserva, id_reserva } = req.body;

    if (!id_sala || !id_usuario || !data_reserva || !id_reserva) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = ` UPDATE reserva SET id_sala = ?, id_usuario = ?, data_reserva = ? WHERE id_reserva = ?`;
    const values = [id_sala, id_usuario, data_reserva];
    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results);
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Erro ao atualizar reserva!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res
          .status(200)
          .json({ message: "Reserva atualizada com sucesso: " });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } 

  static async deleteReserva(req, res) {
    const reservaId = req.params.id_reserva;
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
        return res.status(200).json({ message: "Reserva Excluido com Sucesso" });
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
        const dataReserva = new Date(results[0].data_hora);
        const dia = dataReserva.getDate();
        const mes = dataReserva.getMonth() + 1;
        const ano = dataReserva.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const now = new Date();
        const ReservasPassados = results.filter(
          (Reserva) => new Date(Reserva.data_hora) < now
        );
        const ReservasFuturos = results.filter(
          (Reserva) => new Date(Reserva.data_hora) >= now
        );

        const diferencaMs =
          ReservasFuturos[0].data_hora.getTime() - now.getTime();
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
            new Date(Reserva.data_hora).toISOString().split("T")[0] ===
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
            new Date(Reserva.data_hora).toISOString().split("T")[0] >=
              dataFiltro[0] &&
            new Date(Reserva.data_hora).toISOString().split("T")[0] <
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
