const setErrorMessage = (message, isError = true) => {
    const messageEl = document.getElementById('form-message');
    if (!messageEl) return;
    messageEl.textContent = message;
    messageEl.style.marginTop = '12px';
    messageEl.style.fontFamily = 'Roboto, sans-serif';
    messageEl.style.fontWeight = '600';
    messageEl.style.color = isError ? '#b42318' : '#166534';
}

const API_BASE_URL = 'http://localhost:3000';
const form = document.getElementById('login-form');
form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
        email: String(formData.get('email') || '').trim().toLowerCase(),
        password: String(formData.get('password') || '')
    };
    if (!payload.email || !payload.password) {
        setErrorMessage('Preencha todos os campos.', true);
        return;
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }});

        form.reset();
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        setErrorMessage('Login realizado com sucesso.', false);
        window.location.href = './dashboard.html';

    } catch (error) {
        const apiMessage = error?.response?.data?.message;
        setErrorMessage(apiMessage || 'Erro de conexao com a API. Verifique se o backend esta ativo.', true);
    };})
