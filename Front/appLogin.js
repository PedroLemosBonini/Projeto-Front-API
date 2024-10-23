document
.getElementById("login_formulario").addEventListener("submit", loginUser)

function loginUser(event){

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
  
    fetch("http://localhost:5000/projeto_reserva_senai/v1/userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

        alert(data.message);
        console.log(data.message);

        document.getElementById("login_formulario").reset();
      })
      .catch((error) => {
        // Captura qualquer erro que ocorra durante o processo de requisição / resposta
  
        // Exibe alerta(front) com o erro processado
        alert("Erro no login: " + error.message);
  
        console.error("Erro: ", error.message);
      });
  }
  