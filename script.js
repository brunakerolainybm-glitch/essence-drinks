// ==========================================
// ESSENCE DRINKS - ORÇAMENTOS
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

let insumos =
    JSON.parse(localStorage.getItem("essenceInsumos")) || [];

let eventos =
    JSON.parse(localStorage.getItem("essenceEventos")) || [];


// ==========================================
// FORMATAÇÃO
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
// DRINKS
// ==========================================

function carregarDrinks() {

    const lista = document.getElementById("listaDrinks");

    if (!lista) return;

    lista.innerHTML = `

        <div style="
            background:#f7f3eb;
            padding:15px;
            border-radius:10px;
            margin-bottom:15px;
        ">

            <strong>🍹 Cálculo do evento</strong>

            <div class="campo" style="margin-top:12px;">

                <label>
                    Drinks por pessoa
                </label>

                <input
                    type="number"
                    id="drinksPorPessoa"
                    min="1"
                    step="1"
                    value="4"
                    oninput="atualizarQuantidadeDrinks()"
                >

            </div>

            <div class="campo">

                <label>
                    Valor por pessoa
                </label>

                <input
                    type="number"
                    id="valorPorPessoa"
                    min="0"
                    step="0.01"
                    value="34.90"
                    oninput="calcularOrcamento()"
                >

            </div>

            <div style="
                margin-top:12px;
                font-size:18px;
                font-weight:bold;
            ">

                Total de drinks:
                <span id="totalDrinksAutomatico">0</span>

            </div>

            <div style="
                margin-top:8px;
                font-size:18px;
                font-weight:bold;
            ">

                Valor do orçamento:
                <span id="valorPorPessoaTotal">R$ 0,00</span>

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
                                value="0"
                                readonly
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
// CALCULAR QUANTIDADE DE DRINKS
// ==========================================

function atualizarQuantidadeDrinks() {

    const convidados =
        Number(
            document.getElementById("convidados")?.value || 0
        );

    const campoMedia =
        document.getElementById("drinksPorPessoa");

    const mediaDrinks =
        Number(campoMedia?.value || 0);

    const totalDrinks =
        convidados * mediaDrinks;

    const selecionados = [];

    drinks.forEach(function(drink, index) {

        const checkbox =
            document.getElementById(
                `selecionarDrink${index}`
            );

        if (checkbox && checkbox.checked) {
            selecionados.push(index);
        }
    });

    const quantidadeSelecionados =
        selecionados.length;

    const totalElement =
        document.getElementById(
            "totalDrinksAutomatico"
        );

    if (totalElement) {
        totalElement.textContent =
            totalDrinks;
    }

    if (quantidadeSelecionados === 0) {

        drinks.forEach(function(drink, index) {

            const campo =
                document.getElementById(
                    `quantidadeDrink${index}`
                );

            if (campo) {
                campo.value = 0;
            }
        });

        calcularOrcamento();
        return;
    }

    const quantidadeBase =
        Math.floor(
            totalDrinks /
            quantidadeSelecionados
        );

    const restante =
        totalDrinks %
        quantidadeSelecionados;

    drinks.forEach(function(drink, index) {

        const campo =
            document.getElementById(
                `quantidadeDrink${index}`
            );

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

        campo.value =
            quantidade;
    });

    calcularOrcamento();
}


// ==========================================
// CALCULAR ORÇAMENTO
// ==========================================

function calcularOrcamento() {

    const convidados =
        Number(
            document.getElementById("convidados")?.value || 0
        );

    const valorPorPessoa =
        Number(
            document.getElementById("valorPorPessoa")?.value || 0
        );

    const valorDrinks =
        convidados * valorPorPessoa;

    const valorPorPessoaTotal =
        document.getElementById(
            "valorPorPessoaTotal"
        );

    if (valorPorPessoaTotal) {
        valorPorPessoaTotal.textContent =
            dinheiro(valorDrinks);
    }

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

    const custoInsumos =
        Number(
            window.custoInsumosAtual || 0
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
            valorOrcamento -
            valorRecebido,
            0
        );

    const elementoValorDrinks =
        document.getElementById("valorDrinks");

    const elementoCustoInsumos =
        document.getElementById("custoInsumos");

    const elementoCustoTotal =
        document.getElementById("custoTotal");

    const elementoValorOrcamento =
        document.getElementById("valorOrcamento");

    const elementoLucro =
        document.getElementById("lucro");

    const elementoFaltaReceber =
        document.getElementById("faltaReceber");

    if (elementoValorDrinks) {
        elementoValorDrinks.textContent =
            dinheiro(valorDrinks);
    }

    if (elementoCustoInsumos) {
        elementoCustoInsumos.textContent =
            dinheiro(custoInsumos);
    }

    if (elementoCustoTotal) {
        elementoCustoTotal.textContent =
            dinheiro(custoTotal);
    }

    if (elementoValorOrcamento) {
        elementoValorOrcamento.textContent =
            dinheiro(valorOrcamento);
    }

    if (elementoLucro) {
        elementoLucro.textContent =
            dinheiro(lucro);
    }

    if (elementoFaltaReceber) {
        elementoFaltaReceber.textContent =
            dinheiro(faltaReceber);
    }

    return {
        valorDrinks,
        valorEstrutura,
        outrosCustos,
        custoInsumos,
        custoTotal,
        valorOrcamento,
        valorRecebido,
        faltaReceber,
        lucro
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

    const mediaDrinks =
        Number(
            document.getElementById("drinksPorPessoa")?.value || 0
        );

    const valorPorPessoa =
        Number(
            document.getElementById("valorPorPessoa")?.value || 0
        );

    const totalDrinks =
        convidados * mediaDrinks;

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

    if (mediaDrinks <= 0) {
        alert("Informe os drinks por pessoa.");
        return;
    }

    const calculo =
        calcularOrcamento();

    const bebidas = [];

    drinks.forEach(function(drink, index) {

        const checkbox =
            document.getElementById(
                `selecionarDrink${index}`
            );

        const quantidade =
            Number(
                document.getElementById(
                    `quantidadeDrink${index}`
                ).value || 0
            );

        if (
            checkbox &&
            checkbox.checked &&
            quantidade > 0
        ) {

            bebidas.push({
                nome: drink.nome,
                quantidade: quantidade
            });
        }
    });

    const evento = {

        id: Date.now(),

        cliente,

        dataEvento,

        tipoEvento,

        localEvento,

        convidados,

        horas,

        mediaDrinksPorPessoa:
            mediaDrinks,

        totalDrinks,

        valorPorPessoa,

        bebidas,

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

        valorRecebido,

        faltaReceber:
            calculo.faltaReceber,

        lucro:
            calculo.lucro,

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

    const campoMedia =
        document.getElementById("drinksPorPessoa");

    if (campoMedia) {
        campoMedia.value = 4;
    }

    const campoValor =
        document.getElementById("valorPorPessoa");

    if (campoValor) {
        campoValor.value = 34.90;
    }

    drinks.forEach(function(drink, index) {

        const quantidade =
            document.getElementById(
                `quantidadeDrink${index}`
            );

        const checkbox =
            document.getElementById(
                `selecionarDrink${index}`
            );

        if (quantidade) {
            quantidade.value = 0;
        }

        if (checkbox) {
            checkbox.checked = true;
        }
    });

    atualizarQuantidadeDrinks();
}


// ==========================================
// EVENTOS
// ==========================================

function carregarEventos() {

    const lista =
        document.getElementById("listaEventos");

    if (!lista) return;

    if (eventos.length === 0) {

        lista.innerHTML = `
            <div class="vazio">
                <h3>Nenhum evento cadastrado.</h3>
                <p>Crie seu primeiro orçamento.</p>
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

            const bebidas =
                evento.bebidas
                    ?.map(function(bebida) {
                        return `${bebida.nome}: ${bebida.quantidade}`;
                    })
                    .join(" | ")
                || "Nenhum";

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
                        <strong>Drinks por pessoa:</strong>
                        ${evento.mediaDrinksPorPessoa || 0}
                    </p>

                    <p>
                        <strong>Total de drinks:</strong>
                        ${evento.totalDrinks || 0}
                    </p>

                    <p>
                        <strong>Valor por pessoa:</strong>
                        ${dinheiro(evento.valorPorPessoa || 0)}
                    </p>

                    <p>
                        <strong>Drinks:</strong>
                        ${bebidas}
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

                    <span class="status">
                        ${status}
                    </span>

                    <br><br>

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
// DATA
// ==========================================

function formatarData(data) {

    if (!data) return "-";

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

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

    if (!confirmar) return;

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
// INSUMOS
// ==========================================

function cadastrarInsumo() {

    const nome =
        document.getElementById(
            "nomeInsumo"
        ).value.trim();

    const unidade =
        document.getElementById(
            "unidadeInsumo"
        ).value;

    const quantidade =
        Number(
            document.getElementById(
                "quantidadeInsumo"
            ).value || 0
        );

    const preco =
        Number(
            document.getElementById(
                "precoInsumo"
            ).value || 0
        );

    if (!nome) {
        alert("Digite o nome do insumo.");
        return;
    }

    if (quantidade <= 0) {
        alert("Informe a quantidade comprada.");
        return;
    }

    if (preco <= 0) {
        alert("Informe o preço pago.");
        return;
    }

    const custoUnitario =
        preco / quantidade;

    const insumo = {
        id: Date.now(),
        nome,
        unidade,
        quantidade,
        preco,
        custoUnitario
    };

    insumos.push(insumo);

    localStorage.setItem(
        "essenceInsumos",
        JSON.stringify(insumos)
    );

    document.getElementById(
        "nomeInsumo"
    ).value = "";

    document.getElementById(
        "quantidadeInsumo"
    ).value = "";

    document.getElementById(
        "precoInsumo"
    ).value = "";

    carregarInsumos();

    alert("✅ Insumo cadastrado!");
}


// ==========================================
// CARREGAR INSUMOS
// ==========================================

function carregarInsumos() {

    const lista =
        document.getElementById(
            "listaInsumos"
        );

    if (!lista) return;

    if (insumos.length === 0) {

        lista.innerHTML = `
            <div class="vazio">
                <p>Nenhum insumo cadastrado.</p>
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

    if (!confirmar) return;

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

        const campoConvidados =
            document.getElementById(
                "convidados"
            );

        if (campoConvidados) {

            campoConvidados.addEventListener(
                "input",
                atualizarQuantidadeDrinks
            );
        }
    }
);