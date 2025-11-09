## MotoVision

Aplicativo mobile desenvolvido com **React Native + Expo** para demonstrar a gestão de motos e pátios da empresa parceira **Mottu**, incluindo autenticação, cadastro de veículos, gerenciamento de pátios, perfil do usuário e configurações com suporte a múltiplos temas e idiomas.

## Proposta e funcionalidades

- Login, cadastro e recuperação de senha com armazenamento seguro de credenciais.
- Dashboard de escolhas com acesso a pátio, formulário, desenvolvedores, configurações e perfil.
- Gestão de motos e pátios: listagem, criação, edição e exclusão, com status e notificações.
- Formulário de cadastro de motos com validações e envio de push notification.
- Configurações com modo escuro, modo Mottu, alternância de idioma (PT/ES) e tela **Sobre o App** exibindo o hash do commit publicado.
- Perfil do usuário com edição de dados pessoais e gerenciamento de conta.

## Integrantes

- **Cícero Gabriel Oliveira Serafim** – RM556996 – [github.com/ciceroserafim](https://github.com/ciceroserafim)  
- **Eduardo Miguel Forato Monteiro** – RM555871 – [github.com/EduardoMiguelFM](https://github.com/EduardoMiguelFM)  
- **Murillo Ari Sant'Anna** – RM557183 – [github.com/Murillo77](https://github.com/Murillo77)

## Como rodar o projeto

```bash
git clone https://github.com/ciceroserafim/Challenge.git
cd Challenge
npm install
npm start
```

- No Expo Go ou emulador Android, leia o QR Code ou pressione `a` no terminal para abrir no emulador configurado.

## Estrutura de pastas

```
├── assets/              # Ícones, splash e imagens estáticas
├── context/             # Providers de tema e internacionalização
├── images/              # Fotos dos integrantes
├── locales/             # Arquivos de tradução (pt/es)
├── screens/             # Telas principais (login, pátio, formulário, etc.)
├── services/            # Integração com API e autenticação
├── utils/               # Utilitários (ex: notificações)
├── App.js               # Entrada do app com navegação e providers
├── app.json             # Configurações Expo (metadados, splash, ícones)
├── commit-info.json     # Hash de commit usado na build publicada
├── eas.json             # Perfis de build EAS
├── package.json         # Dependências e scripts
└── README.md            # Documentação do projeto
```
## Link para o video demonstrativo: https://youtu.be/Y4S4IJYvepQ
