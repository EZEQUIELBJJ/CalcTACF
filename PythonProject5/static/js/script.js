// TACF - Teste de Avaliação do Condicionamento Físico
// JavaScript para validação de formulários e interatividade

document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos do DOM
    const tacfForm = document.getElementById('tacf-form');
    const generoSelect = document.getElementById('genero');
    const idadeInput = document.getElementById('idade');
    const estaturaInput = document.getElementById('estatura');
    const cinturaInput = document.getElementById('cintura');
    const flexoesInput = document.getElementById('flexoes');
    const abdominaisInput = document.getElementById('abdominais');
    const corridaInput = document.getElementById('corrida');
    const btnSubmit = document.getElementById('btn-calcular');
    const btnReset = document.getElementById('btn-limpar');
    const sobreModal = document.getElementById('sobreModal');
    const flashMessages = document.querySelectorAll('.alert');

    // Validação do formulário antes do envio
    if (tacfForm) {
        tacfForm.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    // Validar todos os campos do formulário
    function validateForm() {
        let isValid = true;

        // Validação básica para cada campo
        if (!generoSelect.value) {
            showError(generoSelect, 'Selecione o gênero');
            isValid = false;
        } else {
            clearError(generoSelect);
        }

        // Idade: entre 16 e 80 anos
        const idade = parseInt(idadeInput.value);
        if (isNaN(idade) || idade < 16 || idade > 80) {
            showError(idadeInput, 'Idade deve estar entre 16 e 80 anos');
            isValid = false;
        } else {
            clearError(idadeInput);
        }

        // Estatura: entre 140 e 220 cm
        const estatura = parseFloat(estaturaInput.value);
        if (isNaN(estatura) || estatura < 140 || estatura > 220) {
            showError(estaturaInput, 'Estatura deve estar entre 140 e 220 cm');
            isValid = false;
        } else {
            clearError(estaturaInput);
        }

        // Cintura: entre 50 e 150 cm
        const cintura = parseFloat(cinturaInput.value);
        if (isNaN(cintura) || cintura < 50 || cintura > 150) {
            showError(cinturaInput, 'Medida da cintura deve estar entre 50 e 150 cm');
            isValid = false;
        } else {
            clearError(cinturaInput);
        }

        // Flexões: valor não negativo
        const flexoes = parseInt(flexoesInput.value);
        if (isNaN(flexoes) || flexoes < 0) {
            showError(flexoesInput, 'Número de flexões deve ser positivo');
            isValid = false;
        } else {
            clearError(flexoesInput);
        }

        // Abdominais: valor não negativo
        const abdominais = parseInt(abdominaisInput.value);
        if (isNaN(abdominais) || abdominais < 0) {
            showError(abdominaisInput, 'Número de abdominais deve ser positivo');
            isValid = false;
        } else {
            clearError(abdominaisInput);
        }

        // Distância de corrida: entre 1000 e 5000 metros
        const distancia = parseInt(corridaInput.value);
        if (isNaN(distancia) || distancia < 1000 || distancia > 5000) {
            showError(corridaInput, 'Distância deve estar entre 1000 e 5000 metros');
            isValid = false;
        } else {
            clearError(corridaInput);
        }

        return isValid;
    }

    // Exibir mensagem de erro para um campo
    function showError(input, message) {
        // Remover mensagem de erro anterior, se existir
        clearError(input);

        // Adicionar classe de erro ao campo
        input.classList.add('is-invalid');

        // Criar e adicionar mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.innerText = message;
        input.parentNode.appendChild(errorDiv);
    }

    // Limpar mensagem de erro de um campo
    function clearError(input) {
        input.classList.remove('is-invalid');
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Validar os campos durante a digitação
    if (idadeInput) idadeInput.addEventListener('input', function() { validateField(this, 16, 80); });
    if (estaturaInput) estaturaInput.addEventListener('input', function() { validateField(this, 140, 220); });
    if (cinturaInput) cinturaInput.addEventListener('input', function() { validateField(this, 50, 150); });
    if (flexoesInput) flexoesInput.addEventListener('input', function() { validateField(this, 0, null); });
    if (abdominaisInput) abdominaisInput.addEventListener('input', function() { validateField(this, 0, null); });

    // Validar um campo numérico (min e max são opcionais)
    function validateField(input, min, max) {
        const value = parseFloat(input.value);

        if (isNaN(value)) {
            input.classList.add('is-invalid');
            return false;
        }

        if (min !== null && value < min) {
            input.classList.add('is-invalid');
            return false;
        }

        if (max !== null && value > max) {
            input.classList.add('is-invalid');
            return false;
        }

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    // Validação do campo de distância de corrida
    if (corridaInput) {
        corridaInput.addEventListener('input', function() {
            validateField(this, 1000, 5000);
        });
    }

    // Animação para os cards de resultado
    const scoreCards = document.querySelectorAll('.score-card');
    if (scoreCards.length > 0) {
        scoreCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, 100 * index);
        });
    }

    // Fechar mensagens flash automaticamente
    if (flashMessages.length > 0) {
        flashMessages.forEach(message => {
            setTimeout(() => {
                message.classList.add('fade');
                setTimeout(() => {
                    message.remove();
                }, 500);
            }, 5000);
        });
    }

    // Tooltip para ícones de informação
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
});