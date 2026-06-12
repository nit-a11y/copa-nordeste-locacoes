// Validações do Frontend (Stack NIT)

export function validarNomeUsuario(nome) {
  if (!nome || !nome.trim()) {
    return { valido: false, mensagem: "Por favor, preencha o nome do colaborador." };
  }
  if (nome.trim().length < 2) {
    return { valido: false, mensagem: "O nome do colaborador deve conter pelo menos 2 caracteres." };
  }
  return { valido: true };
}
