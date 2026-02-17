const termo = window.document.querySelector("#frente");
const definicao = window.document.querySelector("#verso");
const btnAdicionar = window.document.querySelector("#btnAdicionar");
const btnGaleria = window.document.querySelector("#btnGaleria");
const categoria = window.document.querySelector("#categoria");
//Criei um array para adicionar os objetos que vão receber os valores dos cards criados


//Adicione a propriedade categoria aos cards (Nova tarefa)
function NovoCard(termo, definicao, categoria) {
    this.termo = termo.value;
    this.definicao = definicao.value;
    this.categoria = categoria.value

}

btnAdicionar.addEventListener("click", verificador);
btnGaleria.addEventListener("click", exibirCards);

function verificador() {
    try {
        if (termo.value == "" || definicao.value == "" || categoria.value == "") {
            throw new Error;
        }

        let dadosFormatados = JSON.parse(localStorage.getItem(categoria.value)) || [];

        // 2. Cria o novo objeto usando sua função construtora
        let novo = new NovoCard(termo, definicao, categoria);

        // 3. Adiciona ao array (que veio do localStorage ou nasceu vazio agora)
        dadosFormatados.push(novo);

        // 4. Salva no localStorage (se a chave não existia, ela é criada aqui)
        localStorage.setItem(categoria.value, JSON.stringify(dadosFormatados));

        // 5. Limpa os campos
        categoria.value = "";
        termo.value = "";
        definicao.value = "";


    } catch (error) {
        window.alert("Preencha todos os campos para salvar um novo card");
    }

}


function exibirCards() {
    if (localStorage.length === 0) {
        window.alert("Não ha cards cadastrados");
    } else {
        btnGaleria.disabled = true;
        const secao2 = window.document.createElement("div");
        const container = window.document.createElement("div");
        const divCategoria = window.document.createElement("div");
        const divQuantidade = window.document.createElement("div");
        const cabecalho = window.document.createElement("header");
        const tituloCard = window.document.createElement("p");
        const qtdCards = window.document.createElement("p");
        const btnBackup = window.document.createElement("button");
        const tagBackup = window.document.createElement("a");
        const inputFiltro = window.document.createElement("input");


        btnBackup.addEventListener("click", exportarBackup);
        inputFiltro.addEventListener("input", filtrarCards);


        secao2.classList.add("classSecao2");
        inputFiltro.classList.add("classFiltro");
        container.classList.add("classGaleria");
        cabecalho.classList.add("classHeader");
        divCategoria.classList.add("classCategoria");
        divQuantidade.classList.add("classQuantidade");
        btnBackup.classList.add("classBackup");

        tituloCard.textContent = "Categoria";
        qtdCards.textContent = "Qtd de Cards";
        btnBackup.textContent = "BACKUP";

        inputFiltro.setAttribute("placeholder", "Filtar por categoria");
        inputFiltro.setAttribute("type", "text");


        secao2.appendChild(inputFiltro);

        cabecalho.appendChild(tituloCard);
        cabecalho.appendChild(qtdCards);
        secao2.appendChild(cabecalho);
        console.log(btnBackup.textContent);


        let conteudoCategoria = "";
        let conteudoQuantidade = "";
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            const valor = localStorage.getItem(chave);
            const valorObjeto = JSON.parse(valor);

            //tenho que fazer a verificação aqui, se um localStorage estiver vazio ja exclui ele, se não exiba a chave e o lenght dele. 
            if (valorObjeto.length == 0) {
                localStorage.removeItem(chave);
                continue
            } else {

                conteudoCategoria += `<p>${chave}</p>`; //-> Armazenar esse cara em uma variavel. usar a variavel como parametro da função de clique e só ai trabalhar com ela?
                conteudoQuantidade += `<p>${valorObjeto.length}</p>`;

            }


        }

        divCategoria.innerHTML = conteudoCategoria;
        divQuantidade.innerHTML = conteudoQuantidade;




        container.appendChild(divCategoria);
        container.appendChild(divQuantidade);
        secao2.appendChild(container);
        tagBackup.appendChild(btnBackup)
        secao2.appendChild(tagBackup);
        document.body.appendChild(secao2);



        function exportarBackup() {
            let dados = "";
            for (let contador = 0; contador < localStorage.length; contador++) {
                const chave = localStorage.key(contador);
                const valor = localStorage.getItem(chave);
                dados += valor;


            }

            let dadosFormatados = dados.split("]");
            console.log(dadosFormatados);

            const blobBackup = new Blob(dadosFormatados, { type: "text/plain" });
            const ticket = URL.createObjectURL(blobBackup);
            console.log(ticket);

            tagBackup.setAttribute("href", ticket);
            tagBackup.setAttribute("download", "backup.txt");


            setTimeout(() => {
                URL.revokeObjectURL(ticket)
            }, 1000); //-> A ideia aq é liberar a memória após ter concluido o download


        }

        function filtrarCards() {

            let indiceBusca;
            let pCategoria = divCategoria.getElementsByTagName("p"); // -> Nessa linha ele me retorna um array com todos os paragrafos existentes na div categoria. 
            let pQuantidade = divQuantidade.getElementsByTagName("p");




            let arrayCategoria = Array.from(pCategoria); // -> Aqui eu converto a variável p em um array para conseguir usar os métodos de array nele.
            let arrayQuantidade = Array.from(pQuantidade);




            if (inputFiltro.value == "") {
                arrayCategoria.map((elemento) => {
                    return elemento.style.display = "block";
                })

                arrayQuantidade.map((elemento) => {
                    return elemento.style.display = "block";
                })

            } else {
                let filtro = arrayCategoria.filter((elemento, indice) => {


                    return elemento.innerText.toLowerCase().includes(inputFiltro.value.toLowerCase());
                    //O filter me retorna um novo array somente com o elemento que o usuario digitou.

                });
                let buscaFinalizada = arrayCategoria.map((elemento, indice) => {
                    if (elemento.innerText == filtro[0].innerText) {
                        elemento.style.display = "block";
                        indiceBusca = indice;

                    } else {
                        elemento.style.display = "none";
                    };



                });

                arrayQuantidade.map((elemento, indice) => {

                    if (indice == indiceBusca) {
                        elemento.style.display = "block"
                    } else {
                        elemento.style.display = "none";
                    }

                });


            }


        }

        let pCategoria = divCategoria.getElementsByTagName("p")
        let pQuantidade = divQuantidade.getElementsByTagName("p");

        let arrayCategoria = Array.from(pCategoria);
        let arrayQuantidade = Array.from(pQuantidade);


        arrayCategoria.forEach((elemento) => {
            elemento.addEventListener("click", estudarCards);



        });

        function estudarCards(event) {

            event.currentTarget.removeEventListener("click", estudarCards);
            const secao3 = window.document.createElement("div");
            const divCard = window.document.createElement("div");
            let dadoParagrafo = event.currentTarget.innerText; //-> Aqui acesso o texto do paragrafo em que o user clicou. 

            let cardString = localStorage.getItem(dadoParagrafo);
            let cardFinalizado = JSON.parse(cardString);
            console.log(cardFinalizado);
            console.log(cardFinalizado.termo);


            //Vou pegar os dados do localStorage em que a chave for igual ao dadoParagrafo, transformar em objeto, e aceesar a propriedade termo e definição, após isso exibir no paragrafo da divTexto.
            //Agora tenho que dar um jeito de colocar isso como paragrafo da divTexto



            const divTexto = window.document.createElement("div");
            const divBotoes = window.document.createElement("div");
            const btnProximo = window.document.createElement("button");
            const btnResposta = window.document.createElement("button");
            const btnExcluir = window.document.createElement("button");


            btnProximo.textContent = "PROXIMO";
            btnExcluir.textContent = "EXCLUIR";
            btnResposta.textContent = "RESPOSTA";


            divTexto.classList.add("divtexto");
            divBotoes.classList.add("divBotoes");
            divCard.classList.add("classDivCard");
            secao3.classList.add("classSecao3")
            btnProximo.setAttribute("id", "btnProximo");
            btnResposta.setAttribute("id", "btnResposta");
            btnExcluir.setAttribute("id", "btnExcluir");

            secao3.appendChild(divCard);
            divCard.appendChild(divTexto);
            divCard.appendChild(divBotoes);
            divBotoes.appendChild(btnResposta);
            divBotoes.appendChild(btnProximo);
            divBotoes.appendChild(btnExcluir);


            document.body.appendChild(secao3);

            console.log(divCard);
            console.log("Deu certo");


            let btnProximoClick = 0;

            btnProximo.addEventListener("click", proximoCard);
            btnResposta.addEventListener("click", exibirResposta);
            btnExcluir.addEventListener("click", excluirCard);

            function proximoCard() {
                console.log(btnProximoClick);
                if (btnProximoClick < cardFinalizado.length - 1) {
                    btnProximoClick += 1;
                    divTexto.innerHTML = `<p> ${cardFinalizado[btnProximoClick].termo}</p> <br>`;

                    console.log(btnProximoClick);
                } else {
                    divTexto.innerHTML = `<p> Você finalizou o card, parabens!</p>`;
                    btnResposta.remove();
                    btnProximo.remove();
                    btnExcluir.remove();
                    let btnVoltar = window.document.createElement("button");
                    btnVoltar.addEventListener("click", () => { //Estou usando um arroFunction anonima 
                        secao3.remove(); //-> Aqui ele exclui a seção de estudos dos cards 
                        arrayCategoria.forEach((elemento) => { //Dei novamente o evento de click aos paragrafos.
                            elemento.addEventListener("click", estudarCards);
                        });
                    })
                    btnVoltar.classList.add("classBtnVoltar");
                    btnVoltar.textContent = "VOLTAR";
                    divBotoes.appendChild(btnVoltar);
                    //Qual função vou adicionar aq? E qual vai ser o propósito dela?

                }

            }

            if (btnProximoClick == 0) {
                divTexto.innerHTML = `<p> ${cardFinalizado[btnProximoClick].termo}</p> <br>`;
            } else {
                proximoCard();


            }

            function exibirResposta() {
                divTexto.innerHTML = `<p>${cardFinalizado[btnProximoClick].definicao}</p>`;
            }

            function excluirCard() {

                if (cardFinalizado.length > 1) {
                    cardFinalizado.splice(btnProximoClick, 1);
                    let subirCard = JSON.stringify(cardFinalizado);//-> Aqui tive que converter o novo Array em Json pq o localStorage só aceita isso.

                    localStorage.setItem(dadoParagrafo, subirCard);//-> Aqui eu subi o novo json para o localStorage na chave em que o usuário clicou lá em cima.
                } else {
                    localStorage.removeItem(dadoParagrafo);
                }
                // -> Aqui eu exclui o elmento do array cardFinalizado no indice em que o meu navegador esta.
                let indiceElementoExcluido;
                arrayCategoria.forEach((elemento, indice) => {
                    if (elemento.innerText == dadoParagrafo) {
                        elemento.style.display = "none";
                        indiceElementoExcluido = indice;
                    }
                });

                arrayQuantidade.forEach((elemento, indice) => {
                    if (indiceElementoExcluido == indice) {
                        elemento.style.display = "none";
                    }
                });




                divBotoes.remove();
                let msgExclusao = window.document.createElement("div");
                let msgBackdrop = window.document.createElement("div");
                let btnOk = window.document.createElement("button");

                btnOk.addEventListener("click", () => {
                    secao2.remove();
                    secao3.remove();
                    exibirCards();
                });
                msgExclusao.classList.add("classMsgExclusao");
                msgBackdrop.classList.add("msgBackdrop");
                msgExclusao.textContent = "Card Excluido com sucesso!";
                btnOk.textContent = "OK";
                msgExclusao.appendChild(btnOk);
                secao3.appendChild(msgExclusao);
                secao3.appendChild(msgBackdrop);
                //Criar uma div com uma mensagem de bem sucedido e depois só reexibir a seção 2




            }

        }


    }
}





//Ao abrir a galeria, dar um jeito de atualizar ela caso o usuário adicione algo novo, ou a cada tantos segundos ele verifica se ha algo novo.





