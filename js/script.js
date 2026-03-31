// PetShop Amigo Fiel - Fase 2 - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐾 PetShop Fase 2 carregado com sucesso!');
    
    // Validação Formulário Cadastro
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', validarCadastro);
    }
    
    // Validação Formulário Agendamento
    const formAgendamento = document.getElementById('formAgendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', validarAgendamento);
        inicializarAgendamento();
    }
    
    // Máscara CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', aplicarMascaraCPF);
    }
    
    // Máscara Telefone
    const telInputs = document.querySelectorAll('input[type="tel"]');
    telInputs.forEach(input => {
        input.addEventListener('input', aplicarMascaraTelefone);
    });
    
    // Auto-preenchimento horário baseado na data
    const dataInput = document.getElementById('dataAgendamento');
    if (dataInput) {
        dataInput.addEventListener('change', verificarDisponibilidade);
    }
});

// === VALIDAÇÕES ===
function validarCadastro(event) {
    event.preventDefault();
    
    let valido = true;
    
    // Reset feedback
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
    
    // Validações específicas
    if (!validarCPF(document.getElementById('cpf').value)) {
        document.getElementById('cpf').classList.add('is-invalid');
        valido = false;
    }
    
    if (!document.querySelector('input[name="sexo"]:checked')) {
        alert('Por favor, selecione o sexo do cliente.');
        valido = false;
    }
    
    if (valido) {
        mostrarSucesso('Cadastro realizado com sucesso! 🎉\nSeus dados foram salvos.');
        formCadastro.reset();
    }
}

function validarAgendamento(event) {
    event.preventDefault();
    
    let valido = true;
    
    // Verifica data futura
    const dataSelecionada = new Date(document.getElementById('dataAgendamento').value);
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    if (dataSelecionada <= hoje) {
        alert('❌ Selecione uma data futura!');
        valido = false;
    }
    
    if (valido) {
        const servico = document.querySelector('input[name="servico"]:checked').value;
        const dados = coletarDadosAgendamento();
        mostrarSucessoAgendamento(dados, servico);
    }
}

// === FUNÇÕES DE AGENDAMENTO ===
function inicializarAgendamento() {
    // Define data mínima (amanhã)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('dataAgendamento').min = tomorrow.toISOString().split('T')[0];
    
    // Listener para mudança de serviço
    document.querySelectorAll('input[name="servico"]').forEach(radio => {
        radio.addEventListener('change', calcularPreco);
    });
    
    document.getElementById('portePet').addEventListener('change', calcularPreco);
}

function calcularPreco() {
    const servico = document.querySelector('input[name="servico"]:checked').value;
    const porte = document.getElementById('portePet').value;
    
    let precoBase = servico === 'local' ? 85 : 125;
    let acrescimoPorte = 0;
    
    if (porte === 'medio') acrescimoPorte = 20;
    if (porte === 'grande') acrescimoPorte = 50;
    
    const total = precoBase + acrescimoPorte;
    document.getElementById('precoTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function verificarDisponibilidade() {
    const data = document.getElementById('dataAgendamento').value;
    const hoje = new Date().toISOString().split('T')[0];
    
    if (data === hoje) {
        // Desabilita horários da manhã se for hoje
        const opcoes = document.getElementById('horario').options;
        for (let i = 0; i < opcoes.length; i++) {
            if (opcoes[i].value <= '12:00') {
                opcoes[i].disabled = true;
            }
        }
    }
}

// === UTILITÁRIOS ===
function aplicarMascaraCPF(e) {
    let valor = e.target.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = valor;
}

function aplicarMascaraTelefone(e) {
    let valor = e.target.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = valor;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function limparFormulario() {
    document.getElementById('formCadastro').reset();
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function limparAgendamento() {
    document.getElementById('formAgendamento').reset();
    calcularPreco();
}

function coletarDadosAgendamento() {
    return {
        servico: document.querySelector('input[name="servico"]:checked').value,
        data: document.getElementById('dataAgendamento').value,
        horario: document.getElementById('horario').value,
        cliente: document.getElementById('nomeClienteAgenda').value,
        telefone: document.getElementById('telefoneAgenda').value,
        pet: document.getElementById('nomePetAgenda').value,
        porte: document.getElementById('porteAgenda').value
    };
}

function mostrarSucesso(mensagem) {
    alert(mensagem);
}

function mostrarSucessoAgendamento(dados, servico) {
    const mensagem = `✅ AGENDAMENTO CONFIRMADO!\n\n` +
                    `Serviço: ${servico === 'local' ? 'No Local' : 'Tele-busca'}\n` +
                    `Data: ${dados.data} às ${dados.horario}\n` +
                    `Cliente: ${dados.cliente}\n` +
                    `Pet: ${dados.pet} (${dados.porte})\n` +
                    `Contato: ${dados.telefone}\n\n` +
                    `Entre em contato para confirmação! 📞`;
    
    alert(mensagem);
    document.getElementById('formAgendamento').reset();
    calcularPreco();
}

// === EFEITOS VISUAIS ===
function adicionarAnimacaoScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

addEventListener('load', adicionarAnimacaoScroll);