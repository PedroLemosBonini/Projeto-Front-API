
  //document.addEventListener("DOMContentLoaded", getAllUsers);

  // Chamada da função createUser para associação ao evento de envio do formulário
  document.getElementById("formulario_registro").addEventListener("submit", createUser);
  
  function createUser(event) {
    // Previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarregue a página
    event.preventDefault();
    // Captura os valores dos campos do formulário
    const nome = document.getElementById("nome").value;
    const telefone= document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
  
    // Requisição HTTP para o endpoint de cadastro de usuário
    fetch("http://localhost:5000/projeto_reserva_senai/v1/usuario/", {
      // Realiza uma chamada HTTP para o servidor (a rota definida)
      method: "POST",
      headers: {
        // A requisição será em formato JSON
        "Content-Type": "application/json",
      },
      // Transforma os dados do formulário em uma string JSON para serem enviados no corpo da requisição
      body: JSON.stringify({ nome, telefone, senha, email }),
    })
      .then((response) => {
        // Tratamento da resposta do servidor/api
        if (response.ok) {
          // Verifica se a resposta foi bem sucedida (status 2XX)
          return response.json();
        }
        // Convertendo o erro em formato json
        return response.json().then((err) => {
          // Mensagem retornada do servidor, acessada pela chave "error"
          throw new Error(err.error);
        });
      }) // Fechamendo da then(response)
      .then((data) => {
        // Executa a resposta de sucesso - retorna ao usuário final

        // Exibe um alerta para o usuário final(front) com o nome do usuário que acabou de ser cadastrado
        alert(data.message);
        console.log(data.message);
  
        // Reseta os campos do formulário após o sucesso do cadastro
        document.getElementById("formulario_registro").reset();
        window.location.href = "../index.html"
      })
      .catch((error) => {
        // Captura qualquer erro que ocorra durante o processo da resposta
  
        // Exibe alerta(front) com o erro processado
        alert("Erro no cadastro: " + error.message);
  
        console.error("Erro: ", error.message);
      });
  }

 