# Central BTS Coreia — Rose Freitas

Aplicativo web em preto e dourado para reunir notícias do BTS no Daum.

## Recursos

- Botão para consultar nove buscas: BTS, 방탄소년단 e os sete integrantes.
- Filtros por integrante, assunto e período; pesquisa nos resultados.
- Deduplicação por URL e título, ordenação por publicação e horários aproximados de Brasília e Seul.
- Comparação com a consulta anterior neste navegador usando armazenamento local.
- Links para o original e para leitura no Google Tradutor. Os títulos e trechos do painel permanecem no idioma original; não há tradução ou resumo por IA dentro do painel.
- Erros e consultas parciais indicados na interface. Não há notícias fictícias.

## Executar no computador

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 e clique em **Buscar últimas notícias**.

Para produção:

```bash
npm install
npm run build
npm start
```

O servidor escuta em `0.0.0.0`, porta 3000 ou a porta definida na variável `PORT`.

## Hospedagem

Este projeto usa **Next.js com servidor Node.js**. Importe o repositório em uma hospedagem com suporte a Next.js/Node, utilizando os comandos acima. **GitHub Pages não executa `/api/news` e não atende este aplicativo sozinho.**

Nenhuma chave de API é necessária para a primeira versão. Não há `.env` com credenciais no repositório. A privacidade do repositório não protege automaticamente um futuro site publicado: configure a proteção de acesso na hospedagem caso queira manter o aplicativo privado.

## Fonte e limites

O servidor consulta a primeira página das nove buscas públicas em https://search.daum.net/search?w=news&q=BTS&sort=recency e reutiliza os resultados por até cinco minutos, quando o processo permanece ativo. Não promete cobertura completa. Assuntos e relação com BTS são classificados por palavras-chave, não por verificação editorial.

O Daum pode alterar seu HTML, limitar consultas ou recusar conexões da hospedagem. Não há contorno de bloqueios. Falhas são informadas e o aplicativo oferece o link da busca original. Os logs do servidor registram status HTTP ou falhas de leitura para diagnóstico.

## Estado da verificação

A extração foi conferida com HTML real e nove consultas retornaram 47 matérias em teste local em 5 de outubro de 2026. A publicação anterior em Cloudflare/Sites retornou HTTP 502 em `/api/news`; a causa externa não foi confirmada. Migrar para Node.js não garante, por si só, resolver esse acesso. Teste a coleta na hospedagem escolhida antes de considerar o aplicativo operacional.
