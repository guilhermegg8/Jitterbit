# Recomendações de Segurança

Este documento reúne recomendações para fortalecer a segurança da API.

## 1. Gerenciamento de segredos
- Nunca versionar `.env` ou qualquer segredo no repositório.
- Utilizar um `JWT_SECRET` forte, longo e aleatório.
- Rotacionar segredos periodicamente e após qualquer incidente.

## 2. Autenticação e autorização
- Definir expiração curta para tokens JWT e validar corretamente o `Bearer token`.
- Implementar política de renovação/revogação de token quando necessário.
- Garantir que todas as rotas sensíveis estejam protegidas por middleware de autenticação.

## 3. Proteção de API
- Manter `helmet` habilitado para reforçar headers de segurança.
- Aplicar `rate limit` por IP para reduzir abuso e ataques de força bruta.
- Configurar CORS de forma restritiva (origens, métodos e headers permitidos).

## 4. Validação de entrada
- Validar e sanitizar todos os dados recebidos no corpo, params e query.
- Rejeitar campos inesperados para evitar comportamento não previsto.
- Evitar mensagens de erro detalhadas em produção.

## 5. Banco de dados
- Usar usuário de banco com princípio de menor privilégio.
- Restringir acesso ao MongoDB por rede/IP e autenticação obrigatória.
- Habilitar backup periódico e teste de restauração.

## 6. Dependências e atualizações
- Atualizar dependências regularmente.
- Executar auditoria com `npm audit` e corrigir vulnerabilidades relevantes.
- Evitar bibliotecas sem manutenção.

## 7. Ambiente e operação
- Executar em ambiente separado por estágio (dev/homolog/prod).
- Habilitar logs estruturados e monitoramento de erros/latência.
- Usar HTTPS em produção e redirecionar tráfego HTTP.

## 8. Processo seguro de desenvolvimento
- Revisar código com foco em segurança antes de merge.
- Adicionar testes para autenticação, autorização e cenários de erro.
- Definir plano de resposta a incidentes com responsáveis e passos de contenção.
