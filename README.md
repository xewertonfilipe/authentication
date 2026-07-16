# Bytebank Authentication MFE

Microfrontend responsavel pelo fluxo de autenticacao (login) no shell do Bytebank.

## Visao geral

- Package: `@bytebank/authentication`
- Porta local (webpack): `9007`
- Porta container (docker): `8087`
- Artefato servido: `bytebank-authentication.js`

## Pre-requisitos

1. Node.js 18+
2. npm 9+
3. Docker Desktop (opcional, para execucao via container)

## Instalacao

```bash
npm install
```

## Executando em desenvolvimento (npm)

1. Inicie o servidor de desenvolvimento:

```bash
npm start
```

2. O MFE sera servido em `http://localhost:9007/bytebank-authentication.js`.

3. Para rodar isolado (sem orchestrator), use:

```bash
npm run start:standalone
```

## Executando em desenvolvimento (Docker)

1. Suba o container:

```bash
npm run start:docker
```

2. O MFE sera servido em `http://localhost:8087/bytebank-authentication.js`.

Para parar os containers:

```bash
npm run stop:docker
```

## Integracao com o orchestrator

- Modo local do orchestrator (`isLocal`): consome `http://localhost:9007/bytebank-authentication.js`

## Responsividade

- Layout do login ajustado para telas pequenas, tablets e desktop.
- Breakpoints validados: 320px, 768px e 1024px.
- Ajustes principais: card com largura fluida, imagem responsiva, tipografia escalavel e botao sem largura fixa rigida.

## Scripts uteis

- `npm start`: sobe webpack dev server na porta 9007
- `npm run start:standalone`: executa standalone
- `npm run start:docker`: sobe container Docker com build
- `npm run stop:docker`: derruba containers do Docker Compose
- `npm run build`: build de producao
- `npm test`: executa testes
- `npm run coverage`: executa testes com cobertura
- `npm run lint`: lint
- `npm run type-check`: verificacao de tipos
- `npm run format`: formatacao com Prettier

## Testes

```bash
npm test
```

Para cobertura:

```bash
npm run coverage
```

## Troubleshooting

1. Se a porta `9007` estiver ocupada, finalize o processo em conflito e rode `npm start` novamente.
2. Se o shell nao carregar a tela de login, confirme se o orchestrator esta com import map do ambiente correto.
3. Se houver falha de token/session em desenvolvimento, limpe o Local Storage e recarregue a pagina.
4. Se as chamadas de API estiverem indo para URL errada, valide a variavel `VITE_API_BASE_URL` no ambiente local ou nas Environment Variables da Vercel e gere novo deploy.
