// ==========================================
// ESSENCE DRINKS
// Sistema de Orçamentos para Eventos
// ==========================================

const drinks = [
    {
        nome: "Pink Lemonade",
        descricao: "Soda, limão, morango, vodka e gelo"
    },
    {
        nome: "Gin Tropical",
        descricao: "Gin, energético tropical, laranja e gelo"
    },
    {
        nome: "Sex on the Beach",
        descricao: "Suco de laranja, vodka, gelo e groselha"
    },
    {
        nome: "Caipivodka",
        descricao: "Vodka, frutas frescas, soda e gelo"
    },
    {
        nome: "Moscow Mule",
        descricao: "Vodka, limão, xarope de gengibre, água com gás e espuma de gengibre"
    }
];


// ==========================================
// BANCO DE DADOS LOCAL
// ==========================================

let insumos = JSON.parse(localStorage.getItem("essenceInsumos")) || [];
let eventos = JSON.parse(localStorage.getItem("essenceEventos")) || [];


// ==========================================
// FORMATAÇÃO DE DINHEIRO
// ==========================================

function dinheiro(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==========================================
// TROCAR DE TELA
// ==========================================

function mostrarTela(tela) {

    document.querySelectorAll(".tela").forEach(function(elemento) {

        elemento.classList.remove("ativa");

    });


    const selecionada = document.getElementById(tela);


    if (selecionada) {

        selecionada.classList.add("ativa");

    }


    if (tela === "eventos") {

        carregarEventos();

    }


    if (tela === "insumos") {

        carregarInsumos();

    }


    if (tela === "dashboard") {

        atualizarDashboard();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// CARREGAR DRINKS
// ==========================================

function carregarDrinks() {

    const lista = document.getElementById("listaDrinks");

    if (!lista) return;


    lista.innerHTML = `

        <div class="card" style="margin-bottom:15px;">

            <div class="grid">

                <div>

                    <label>
                        👥 Número de convidados
                    </label>

                    <input
                        type="number"
                        id="convidadosDrinks"
                        min="1"
                        value="50"
                        oninput="atualizarQuantidadeDrinks()"
                    >

                </div>


                <div>

                    <label>
                        🍹 Média de drinks por pessoa
                    </label>

                    <input
                        type="number"
                        id="mediaDrinks"
                        min="1"
                        step="1"
                        value="4"
                        oninput="atualizarQuantidadeDrinks()"
                    >

                </div>

            </div>


            <div style="
                margin-top:15px;
                padding:15px;
                background:#f7f3eb;
                border-radius:10px;
                text-align:center;
            ">

                <span style="
                    display:block;
                    color:#777;
                    font-size:14px;
                ">
                    Total estimado de drinks
                </span>

                <strong
                    id="totalDrinksAutomatico"
                    style="
                        display:block;
                        font-size:28px;
                        color:#26352d;
                        margin-top:5px;
                    "
                >
                    200
                </strong>

            </div>

        </div>


        <div class="drinks-grid">

            ${drinks.map(function(drink, index) {

                return `

                    <div class="drink-card">

                        <div style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                            margin-bottom:10px;
                        ">

                            <input
                                type="checkbox"
                                id="selecionarDrink${index}"
                                checked
                                onchange="atualizarQuantidadeDrinks()"
                                style="
                                    width:20px;
                                    height:20px;
                                "
                            >

                            <h4 style="margin:0;">
                                🍹 ${drink.nome}
                            </h4>

                        </div>


                        <p>
                            ${drink.descricao}
                        </p>


                        <div class="campo">

                            <label>
                                Quantidade automática
                            </label>

                            <input
                                type="number"
                                id="quantidadeDrink${index}"
                                min="0"
                                value="40"
                                readonly
                            >

                        </div>


                        <div class="campo">

                            <label>
                                Preço de venda por drink
                            </label>

                            <input
                                type="number"
                                id="precoDrink${index}"
                                min="0"
                                step="0.01"
                                value="0"
                                placeholder="R$ 0,00"
                                oninput="calcularOrcamento()"
                            >

                        </div>


                        <div class="campo">

                            <label>
                                Custo de insumos por drink
                            </label>

                            <input
                                type="number"
                                id="custoDrink${index}"
                                min="0"
                                step="0.01"
                                value="0"
                                placeholder="R$ 0,00"
                                oninput="calcularOrcamento()"
                            >

                        </div>

                    </div>

                `;

            }).join("")}

        </div>

    `;


    atualizarQuantidadeDrinks();

}


// ==========================================
// DISTRIBUIR DRINKS AUTOMATICAMENTE
// ==========================================

function atualizarQuantidadeDrinks() {

    const convidados =
        Number(
            document.getElementById("convidadosDrinks")?.value || 0
        );


    const media =
        Number(
            document.getElementById("mediaDrinks")?.value || 0
        );


    const totalDrinks =
        convidados * media;


    const selecionados = [];


    drinks.forEach(function(drink, index) {

        const checkbox =
            document.getElementById(`selecionarDrink${index}`);


        if (checkbox && checkbox.checked) {

            selecionados.push(index);

        }

    });


    const totalSelecionados =
        selecionados.length;


    document.getElementById("totalDrinksAutomatico").textContent =
        totalDrinks;


    if (totalSelecionados === 0) {

        drinks.forEach(function(drink, index) {

            const campo =
                document.getElementById(`quantidadeDrink${index}`);

            if (campo) {

                campo.value = 0;

            }

        });


        calcularOrcamento();

        return;

    }


    const quantidadeBase =
        Math.floor(totalDrinks / totalSelecionados);


    const restante =
        totalDrinks % totalSelecionados;


    drinks.forEach(function(drink, index) {

        const campo =
            document.getElementById(`quantidadeDrink${index}`);


        if (!campo) return;


        if (!selecionados.includes(index)) {

            campo.value = 0;

            return;

        }


        const posicao =
            selecionados.indexOf(index);


        let quantidade =
            quantidadeBase;


        if (posicao < restante) {

            quantidade++;

        }


        campo.value = quantidade;

    });


    calcularOrcamento();

}


// ==========================================
// CALCULAR ORÇAMENTO
// ==========================================

function calcularOrcamento() {

    let valorDrinks = 0;

    let custoInsumos = 0;


    drinks.forEach(function(drink, index) {

        const quantidade =
            Number(
                document.getElementById(`quantidadeDrink${index}`)?.value || 0
            );


        const preco =
            Number(
                document.getElementById(`precoDrink${index}`)?.value || 0
            );


        const custo =
            Number(
                document.getElementById(`custoDrink${index}`)?.value || 0
            );


        valorDrinks += quantidade * preco;

        custoInsumos += quantidade * custo;

    });


    const valorEstrutura =
        Number(
            document.getElementById("valorEstrutura")?.value || 0
        );


    const outrosCustos =
        Number(
            document.getElementById("outrosCustos")?.value || 0
        );


    const valorRecebido =
        Number(
            document.getElementById("valorRecebido")?.value || 0
        );


    const valorOrcamento =
        valorDrinks +
        valorEstrutura +
        outrosCustos;


    const custoTotal =
        custoInsumos +
        outrosCustos;


    const lucro =
        valorOrcamento -
        custoTotal;


    const faltaReceber =
        Math.max(
            valorOrcamento - valorRecebido,
            0
        );


    document.getElementById("valorDrinks").textContent =
        dinheiro(valorDrinks);


    document.getElementById("custoInsumos").textContent =
        dinheiro(custoInsumos);


    document.getElementById("custoTotal").textContent =
        dinheiro(custoTotal);


    document.getElementById("valorOrcamento").textContent =
        dinheiro(valorOrcamento);


    document.getElementById("lucro").textContent =
        dinheiro(lucro);


    document.getElementById("faltaReceber").textContent =
        dinheiro(faltaReceber);


    return {

        valorDrinks,

        custoInsumos,

        valorEstrutura,

        outrosCustos,

        valorOrcamento,

        custoTotal,

        lucro,

        valorRecebido,

        faltaReceber

    };

}


// ==========================================
// SALVAR ORÇAMENTO
// ==========================================

function salvarOrcamento() {

    const cliente =
        document.getElementById("cliente").value.trim();


    const dataEvento =
        document.getElementById("dataEvento").value;


    const tipoEvento =
        document.getElementById("tipoEvento").value.trim();


    const localEvento =
        document.getElementById("localEvento").value.trim();


    const convidados =
        Number(
            document.getElementById("convidados").value || 0
        );


    const horas =
        Number(
            document.getElementById("horas").value || 0
        );


    const observacoes =
        document.getElementById("observacoes").value.trim();


    const valorRecebido =
        Number(
            document.getElementById("valorRecebido").value || 0
        );


    if (!cliente) {

        alert("Digite o nome do cliente.");

        return;

    }


    if (!dataEvento) {

        alert("Informe a data do evento.");

        return;

    }


    const calculo =
        calcularOrcamento();


    const bebidas = [];


    drinks.forEach(function(drink, index) {

        const checkbox =
            document.getElementById(`selecionarDrink${index}`);


        const quantidade =
            Number(
                document.getElementById(`quantidadeDrink${index}`).value || 0
            );


        const preco =
            Number(
                document.getElementById(`precoDrink${index}`).value || 0
            );


        const custo =
            Number(
                document.getElementById(`custoDrink${index}`).value || 0
            );


        if (
            checkbox &&
            checkbox.checked &&
            quantidade > 0
        ) {

            bebidas.push({

                nome: drink.nome,

                quantidade: quantidade,

                preco: preco,

                custo: custo,

                subtotal:
                    quantidade * preco

            });

        }

    });


    const evento = {

        id: Date.now(),

        cliente: cliente,

        dataEvento: dataEvento,

        tipoEvento: tipoEvento,

        localEvento: localEvento,

        convidados: convidados,

        horas: horas,

        mediaDrinks:
            Number(
                document.getElementById("mediaDrinks")?.value || 4
            ),

        totalDrinks:
            Number(
                document.getElementById("totalDrinksAutomatico")?.textContent || 0
            ),

        bebidas: bebidas,

        valorDrinks:
            calculo.valorDrinks,

        valorEstrutura:
            calculo.valorEstrutura,

        outrosCustos:
            calculo.outrosCustos,

        custoInsumos:
            calculo.custoInsumos,

        custoTotal:
            calculo.custoTotal,

        valorOrcamento:
            calculo.valorOrcamento,

        valorRecebido:
            valorRecebido,

        faltaReceber:
            calculo.faltaReceber,

        lucro:
            calculo.lucro,

        observacoes:
            observacoes,

        criadoEm:
            new Date().toISOString()

    };


    eventos.push(evento);


    localStorage.setItem(
        "essenceEventos",
        JSON.stringify(eventos)
    );


    alert("✅ Orçamento salvo com sucesso!");


    limparFormulario();


    carregarEventos();


    atualizarDashboard();


    mostrarTela("eventos");

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document.getElementById("cliente").value = "";

    document.getElementById("dataEvento").value = "";

    document.getElementById("tipoEvento").value = "";

    document.getElementById("localEvento").value = "";

    document.getElementById("convidados").value = 50;

    document.getElementById("horas").value = 6;

    document.getElementById("valorEstrutura").value = 0;

    document.getElementById("outrosCustos").value = 0;

    document.getElementById("valorRecebido").value = 0;

    document.getElementById("observacoes").value = "";


    drinks.forEach(function(drink, index) {

        const quantidade =
            document.getElementById(`quantidadeDrink${index}`);


        const preco =
            document.getElementById(`precoDrink${index}`);


        const custo =
            document.getElementById(`custoDrink${index}`);


        const checkbox =
            document.getElementById(`selecionarDrink${index}`);


        if (quantidade)
            quantidade.value = 0;


        if (preco)
            preco.value = 0;


        if (custo)
            custo.value = 0;


        if (checkbox)
            checkbox.checked = true;

    });


    const convidadosDrinks =
        document.getElementById("convidadosDrinks");


    const mediaDrinks =
        document.getElementById("mediaDrinks");


    if (convidadosDrinks)
        convidadosDrinks.value = 50;


    if (mediaDrinks)
        mediaDrinks.value = 4;


    atualizarQuantidadeDrinks();

}


// ==========================================
// LISTAR EVENTOS
// ==========================================

function carregarEventos() {

    const lista =
        document.getElementById("listaEventos");


    if (!lista) return;


    if (eventos.length === 0) {

        lista.innerHTML = `

            <div class="vazio">

                <h3>
                    Nenhum evento cadastrado.
                </h3>

                <p>
                    Crie seu primeiro orçamento.
                </p>

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    eventos
        .slice()
        .reverse()
        .forEach(function(evento) {

            const status =
                evento.faltaReceber <= 0
                    ? "Pagamento completo"
                    : "Pagamento pendente";


            lista.innerHTML += `

                <div class="evento">

                    <h3>
                        🍸 ${evento.cliente}
                    </h3>


                    <p>
                        <strong>Evento:</strong>
                        ${evento.tipoEvento || "Não informado"}
                    </p>


                    <p>
                        <strong>Data:</strong>
                        ${formatarData(evento.dataEvento)}
                    </p>


                    <p>
                        <strong>Local:</strong>
                        ${evento.localEvento || "Não informado"}
                    </p>


                    <p>
                        <strong>Convidados:</strong>
                        ${evento.convidados}
                    </p>


                    <p>
                        <strong>Total de drinks:</strong>
                        ${evento.totalDrinks || 0}
                    </p>


                    <p>
                        <strong>Valor:</strong>
                        ${dinheiro(evento.valorOrcamento)}
                    </p>


                    <p>
                        <strong>Recebido:</strong>
                        ${dinheiro(evento.valorRecebido)}
                    </p>


                    <p>
                        <strong>A receber:</strong>
                        ${dinheiro(evento.faltaReceber)}
                    </p>


                    <p>
                        <strong>Lucro estimado:</strong>
                        ${dinheiro(evento.lucro)}
                    </p>


                    <p>
                        <strong>Drinks selecionados:</strong>
                        ${
                            evento.bebidas
                                ?.map(function(bebida) {

                                    return `${bebida.nome}: ${bebida.quantidade}`;

                                })
                                .join(" | ")
                            || "Nenhum"
                        }
                    </p>


                    <span class="status">
                        ${status}
                    </span>


                    <br>
                    <br>


                    <button
                        class="btn-excluir"
                        onclick="excluirEvento(${evento.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;

        });

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data)
        return "-";


    const partes =
        data.split("-");


    if (partes.length !== 3)
        return data;


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// EXCLUIR EVENTO
// ==========================================

function excluirEvento(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este orçamento?"
        );


    if (!confirmar)
        return;


    eventos =
        eventos.filter(function(evento) {

            return evento.id !== id;

        });


    localStorage.setItem(
        "essenceEventos",
        JSON.stringify(eventos)
    );


    carregarEventos();

    atualizarDashboard();

}


// ==========================================
// CADASTRAR INSUMO
// ==========================================

function cadastrarInsumo() {

    const nome =
        document.getElementById("nomeInsumo").value.trim();


    const unidade =
        document.getElementById("unidadeInsumo").value;


    const quantidade =
        Number(
            document.getElementById("quantidadeInsumo").value || 0
        );


    const preco =
        Number(
            document.getElementById("precoInsumo").value || 0
        );


    if (!nome) {

        alert("Digite o nome do insumo.");

        return;

    }


    if (quantidade <= 0) {

        alert(
            "Informe a quantidade comprada."
        );

        return;

    }


    if (preco <= 0) {

        alert(
            "Informe o preço pago."
        );

        return;

    }


    const custoUnitario =
        preco / quantidade;


    const insumo = {

        id: Date.now(),

        nome: nome,

        unidade: unidade,

        quantidade: quantidade,

        preco: preco,

        custoUnitario:
            custoUnitario

    };


    insumos.push(insumo);


    localStorage.setItem(
        "essenceInsumos",
        JSON.stringify(insumos)
    );


    document.getElementById("nomeInsumo").value = "";

    document.getElementById("quantidadeInsumo").value = "";

    document.getElementById("precoInsumo").value = "";


    carregarInsumos();


    alert("✅ Insumo cadastrado!");

}


// ==========================================
// LISTAR INSUMOS
// ==========================================

function carregarInsumos() {

    const lista =
        document.getElementById("listaInsumos");


    if (!lista)
        return;


    if (insumos.length === 0) {

        lista.innerHTML = `

            <div class="vazio">

                <p>
                    Nenhum insumo cadastrado.
                </p>

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    insumos.forEach(function(insumo) {

        lista.innerHTML += `

            <div class="insumo">

                <div>

                    <strong>
                        ${insumo.nome}
                    </strong>


                    <br>


                    <small>

                        ${insumo.quantidade}
                        ${insumo.unidade}

                        —
                        Compra:
                        ${dinheiro(insumo.preco)}

                    </small>


                    <br>


                    <small>

                        Custo por ${insumo.unidade}:
                        ${dinheiro(insumo.custoUnitario)}

                    </small>

                </div>


                <button
                    class="btn-excluir"
                    onclick="excluirInsumo(${insumo.id})"
                >
                    🗑️
                </button>

            </div>

        `;

    });

}


// ==========================================
// EXCLUIR INSUMO
// ==========================================

function excluirInsumo(id) {

    const confirmar =
        confirm(
            "Deseja excluir este insumo?"
        );


    if (!confirmar)
        return;


    insumos =
        insumos.filter(function(insumo) {

            return insumo.id !== id;

        });


    localStorage.setItem(
        "essenceInsumos",
        JSON.stringify(insumos)
    );


    carregarInsumos();

}


// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    const totalEventos =
        eventos.length;


    const totalFaturamento =
        eventos.reduce(function(total, evento) {

            return total +
                Number(
                    evento.valorOrcamento || 0
                );

        }, 0);


    const totalRecebido =
        eventos.reduce(function(total, evento) {

            return total +
                Number(
                    evento.valorRecebido || 0
                );

        }, 0);


    const totalAReceber =
        eventos.reduce(function(total, evento) {

            return total +
                Number(
                    evento.faltaReceber || 0
                );

        }, 0);


    const totalLucro =
        eventos.reduce(function(total, evento) {

            return total +
                Number(
                    evento.lucro || 0
                );

        }, 0);


    const elementoEventos =
        document.getElementById(
            "totalEventos"
        );


    const elementoFaturamento =
        document.getElementById(
            "totalFaturamento"
        );


    const elementoRecebido =
        document.getElementById(
            "totalRecebido"
        );


    const elementoAReceber =
        document.getElementById(
            "totalAReceber"
        );


    const elementoLucro =
        document.getElementById(
            "totalLucro"
        );


    if (elementoEventos)

        elementoEventos.textContent =
            totalEventos;


    if (elementoFaturamento)

        elementoFaturamento.textContent =
            dinheiro(totalFaturamento);


    if (elementoRecebido)

        elementoRecebido.textContent =
            dinheiro(totalRecebido);


    if (elementoAReceber)

        elementoAReceber.textContent =
            dinheiro(totalAReceber);


    if (elementoLucro)

        elementoLucro.textContent =
            dinheiro(totalLucro);

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarDrinks();

        calcularOrcamento();

        carregarEventos();

        carregarInsumos();

        atualizarDashboard();

    }
);
