let dados = [];
let dataAtual = pegarDataAtual();

document.addEventListener('DOMContentLoaded', () => {
    let botaoAdicionarCopoHoje = document.getElementById('btnAdicionarCopoHoje');
    botaoAdicionarCopoHoje.addEventListener('click', () => {
        tomarAgua(dataAtual);
    });
    // dados = dados.sort((a, b) => {
    //     const dataA = a.data.split('-').reverse().join('');
    //     const dataB = b.data.split('-').reverse().join('');
    //     return dataB.localeCompare(dataA);
    // });
    inicializarRepositorioDados();
    renderizarTabela();
});

function pegarDataAtual() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}-${mes}-${ano}`;
}

function converterJsonParaHtml(dados) {
    let html = dados.map(dado => 
        `<tr>
            <td>${dado.data}</td>
            <td>${dado.copos}</td>
            <td>${
                (dado.copos*0.2).toLocaleString(
                    'pt-BR', 
                    {
                        minimumFractionDigits: 1, 
                        maximumFractionDigits: 1
                    }
                )} L
            </td>
            <td class="acoes">
                <button class="acao acao-adicionar" aria-label="Adicionar copo" onclick="tomarAgua('${dado.data}')">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button class="acao acao-remover" aria-label="Remover copo" onclick="decrementarCopo('${dado.data}')">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </td>
        </tr>`
    ).join('');
    return `<tr>${html}</tr>`;
}

function tomarAgua(data) {
    const indice = dados.findIndex(dado => dado.data === data);
    if (indice !== -1) {
        dados[indice].copos += 1;
    } else {
        dados.unshift({data: data, copos: 1});
    }
    salvarDadosNoRepositorio();
    renderizarTabela();
}

function decrementarCopo(data) {
    const indice = dados.findIndex(dado => dado.data === data);
    if (indice !== -1 && dados[indice].copos > 0) {
        dados[indice].copos -= 1;
    }
    salvarDadosNoRepositorio();
    renderizarTabela();
}

function renderizarTabela() {
    const tabelaCorpo = document.getElementById('dados');
    tabelaCorpo.innerHTML = converterJsonParaHtml(dados);
}

function inicializarRepositorioDados() {
    if (!localStorage.getItem('coposAgua')) {
        localStorage.setItem('coposAgua', JSON.stringify([]));
    } else {
        dados = JSON.parse(localStorage.getItem('coposAgua'));
    }
}

function salvarDadosNoRepositorio() {
    localStorage.setItem('coposAgua', JSON.stringify(dados));
}