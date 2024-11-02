const botao = document.getElementById('botaoForm')
botao.onclick = event => {
    event.preventDefault()
    const form = document.getElementById('loginForm')
    let login = form.elements.login.value
    let senha = form.elements.senha.value
    if (login === '' || login === undefined) {
        alert(`Usuário está vazio`)
    } else if (senha === '' || login === undefined) {
        alert(`Senha está vazia`)
    } else {
        senha = CryptoJS.MD5(form.elements.senha.value).toString();
        jason = JSON.stringify({"tabela" : "Users", "where" : {"username": login, "senha": senha} })
        $.ajax({
            type: "POST",
            url: `https://rest-node-mztn.onrender.com/django/${jason}`,
            dataType: 'json',
            success: (response) => {
                    if (response[0]) {
                        console.log(response[0])
                        form.elements.senha.value = senha
                        form.submit()
                    } else {
                        alert('Credenciais incorretas, senha ou usuário incorretos.')
                    }
            }
        })
    }
}