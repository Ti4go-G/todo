const API_BASE_URL = 'http://localhost:3000';
const form = document.getElementById('register-form');
const messageEl = document.getElementById('form-message');

const setMessage = (text, isError = false) => {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.style.marginTop = '12px';
  messageEl.style.fontFamily = 'Roboto, sans-serif';
  messageEl.style.fontWeight = '600';
  messageEl.style.color = isError ? '#b42318' : '#067647';
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    email: String(formData.get('email') || '').trim().toLowerCase(),
    password: String(formData.get('password') || '')
  };

  if (!payload.email || !payload.password) {
    setMessage('Preencha todos os campos.', true);
    return;
  }

  try {
    setMessage('Enviando...');

    await axios.post(`${API_BASE_URL}/users/register`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setMessage('Cadastro realizado com sucesso. Voce ja pode fazer login.');
    form.reset();

    setTimeout(() => {
      window.location.href = './login.html';
    }, 1200);
  } catch (error) {
    const apiMessage = error?.response?.data?.message;
    setMessage(apiMessage || 'Erro de conexao com a API. Verifique se o backend esta ativo.', true);
  }
});
