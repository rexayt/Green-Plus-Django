const forms1 = document.getElementById('cadastro-produto')
const forms2 = document.getElementById('cadastro-produto-interno')
const enviar = document.getElementById("botao-enviar")
const excluir = document.getElementById("botao-excluir")
const pesquisar = document.getElementById("botao-pesquisar")
const listaForm1 = document.getElementById("sugestoes-nome-popular")
const listaForm2 = document.getElementById("sugestoes-nome")
let nomePopular = []
let nome = []
let form1Data = []
let form2Data = []


const Irrigacao = document.getElementById("irrigacaoSelect")
for (let i = 1; i<31; i++){
    let opt = document.createElement('option')
    opt.value = i
    opt.innerHTML = i
    Irrigacao.appendChild(opt)
}

let query = () => {
    nome = []
    nomePopular = []
    form1Data = []
    form2Data = []
    
    $.ajax({
        type: "GET",
        url: `https://rest-node-mztn.onrender.com/{"tabela":"Produto"}`,
        dataType: 'json',
        success: (response) => {
            try{
                let resposta = JSON.parse(response)
                resposta.forEach(e => {
                    if (e.Categoria === true) {
                        nomePopular.push(e.Nome)
                        form1Data.push(e)
                    } 
                    else if (e.Categoria === false) {
                        console.log
                        nome.push(e.Nome)
                        form2Data.push(e)
                    }
                })}
                catch {
                    setTimeout(
                        query(), 15000
                    )
                }
            }
        })
    }
query()

let listaAparecendo = (lista, autocomplete, form) => {
    form[0].onkeyup = () => {
        if(form[0].value){
            autocomplete.innerHTML = ""
            let valor = form[0].value
            for (item of lista){
                let nome = item.Nome
                if (nome.toLowerCase().startsWith(valor.toLowerCase()) && valor){
                    form[0].style.borderRadius = '10px 10px 0 0'
                    autocomplete.style.display = "block"
                    let li = document.createElement('li')
                    li.innerHTML = `<b>${nome.charAt(0)}</b>${nome.substr(1)}`
                    li.onclick = () => {
                        form[0].value = `${nome}`
                        form[0].style.borderRadius = '10px'
                        autocomplete.style.display = "none"
                    }
                    autocomplete.appendChild(li)
                }
            }
        }
        else {
            form[0].style.borderRadius = '10px'
            autocomplete.style.display = "none"
        }}
    form[0].addEventListener("focusout", () => {
        setTimeout( () => {
            autocomplete.innerHTML = ""
            autocomplete.style.display = "none"
            form[0].style.borderRadius = '10px'
        }, 100)
    })
}

listaAparecendo(form1Data, listaForm1, forms1)
listaAparecendo(form2Data, listaForm2, forms2)

let verificarCampos = (forme) => {
    const formArray = Array.from(forme)
    let formData = {Categoria: " ", Nome: " ", NomeCientifico: " ", Descricao: " ", 	
        EstadoDeConservacao: " ", Classificacao: " ", 	
        TempoEstimado: " ", Temperatura: " ", Irrigacao: " ", ValorVenda: " "}
    let erro = 0
    for(item of formArray){
        let nome = item.name.split('-').map(palavra => {
            return palavra.charAt(0).toUpperCase().concat(palavra.substr(1))
        }).join(' ')

        if (!item.value){
            alert(`O campo: "${nome}" está vazio`)
            erro = 1
            break
        }

        nome = nome.replace(' ', '').replace(' ', '').replace('Popular', '')
        if (nome === "Categoria") {
            if (item.checked){
                formData[nome] = item.value
            }
        }
        else {
            formData[nome] = item.value
        }
    }
    return {erro: erro, formDat: formData}
}

let pesquisarAoClicar = (form, lista) => {
    pesquisar.onclick = () => {
        let existe = 0
        let valor = form[0].value
        for (item of lista){
            if (item.Nome === valor){
                existe = 1
                break
            }
        }
        if (existe === 1){
            let objeto = lista.filter(item => {
                if (item.Nome.toLowerCase() === valor.toLowerCase()){
                    return item
                }
            })
            objeto = objeto[0]
            if (objeto.Nome){
            if (objeto.Categoria === true){
                form[3].value = objeto.NomeCientifico
                form[4].value = objeto.Classificacao
                form[5].value = objeto.TempoEstimado
                form[6].value = objeto.Temperatura
                form[7].value = objeto.Irrigacao
                form[8].value = objeto.ValorVenda
            }else{
                form[3].value = objeto.Descricao
                form[4].value = objeto.EstadoDeConservacao
            }
        }
        else{
            let nome = form[0].name.split('-').map(palavra => {
                return palavra.charAt(0).toUpperCase().concat(palavra.substr(1))
            }).join(' ')
    
            alert(`O campo ${nome} está vazio`)
        }
    }
    else{
        alert("Essa informação não consta no banco de dados")
    }}
        }

let enviarAoClicar = (form, lista) => {
    enviar.onclick = () => {
        let verificado = verificarCampos(form)
        if (verificado.erro === 0){
            let dados = JSON.stringify(verificado.formDat)

            if (lista.includes(verificado.formDat.Nome)){
                $.ajax({
                    type: "PATCH",
                    url: `https://rest-node-mztn.onrender.com/{"tabela":"Produto", "update":${dados}, "where":{"nome":"${form[0].value}"}}`,
                    dataType: 'json',
                    success: () => {
                        form.reset()
                        alert("A sua solicitação de atualização foi enviada ao banco de dados")
                        location.reload()
                    },
                    error: (e) => {
                        form.reset()
                        location.reload()
                    }
                })
            }
            else{
                $.ajax({
                    type: "POST",
                    url: `https://rest-node-mztn.onrender.com/{"tabela":"Produto", "insert":${dados}}`,
                    dataType: 'json',
                    success: () => {
                        form.reset()
                        alert("A sua solicitação de inserir dados foi enviada ao banco de dados")
                        location.reload()
                    }
                })
            }
        }
    }
}

let excluirAoClicar = (form, lista) => {
    excluir.onclick = () => {
        let verificado = verificarCampos(form)
        if (verificado.erro === 0){
            if (lista.includes(verificado.formDat.Nome)){
            console.log(verificado.formDat)
            $.ajax({
                type: "DELETE",
                url: `https://rest-node-mztn.onrender.com/{"tabela":"Produto", "where":${JSON.stringify(verificado.formDat)}}`,
                dataType: 'json',
                success: () => {
                form.reset()
                    alert("A sua solicitação de exclusão do produto "+form[0].value+" foi enviada ao banco de dados")
                    location.reload()
                    },
                error: () => {
                    form.reset()
                    location.reload()
                }
                 });
            };
        }
        else {
            alert('Esse registro não consta no banco de dados')
        };
    }
}

excluirAoClicar(forms1, nomePopular)
enviarAoClicar(forms1, nomePopular)
pesquisarAoClicar(forms1, form1Data)

let trocarForm = (form1, form2, lista, listaData) => {
    form1.style.display = 'none'
    form2.style.display = 'block'
    form1.reset()
    form2.reset()
    enviarAoClicar(form2, lista)
    pesquisarAoClicar(form2, listaData)
    excluirAoClicar(form2, lista)
    listaAparecendo(listaData, listaForm1, forms1)
}


forms1[2].onclick = () => {
    trocarForm(forms1, forms2, nome, form2Data)
}

forms2[1].onclick = () => {
    trocarForm(forms2, forms1, nomePopular, form1Data)
}
