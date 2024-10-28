// Acessa o objeto `document` que representa a página HTML
document
  .getElementById("login_formulario").addEventListener("submit", loginUser) 

function loginUser(event) {

  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  fetch("http://localhost:5000/projeto_reserva_senai/v1/usuarioLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
     // Transforma os dados do formulário em uma string JSON para serem enviados no corpo da requisição
    body: JSON.stringify({ email, senha }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    }) // Fechamendo da then(response)
    .then((data) => {
      // Exibe um alerta para o usuário final(front) com o nome do usuário que acabou de ser cadastrado
      alert(data.message);
      console.log(data.message);

      document.getElementById("login_formulario").reset();
      window.location.href = "home.html"
    })
    .catch((error) => {
      // Captura qualquer erro que ocorra durante o processo de requisição / resposta

      // Exibe alerta(front) com o erro processado
      alert("Erro no login: " + error.message);

      console.error("Erro: ", error.message);
    });
}
