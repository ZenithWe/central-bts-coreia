# Central BTS Coreia — Rose Freitas

Feed em preto e dourado para reunir notícias e publicações de comunidades sobre BTS.

Produção: https://central-bts-coreia.vercel.app/

## Fontes

- Daum: primeira página de nove buscas sobre o grupo e seus integrantes.
- Naver: primeira página de duas buscas públicas, BTS e 방탄소년단.
- TheQoo: tópicos públicos da primeira página do fórum BTS.
- Pann: tópicos públicos do FanTalk BTS. O fórum pode retornar posts antigos, ocultados pelo filtro padrão de sete dias.
- Weibo e X: seleção de links públicos com resumos em português, atualizada pela tarefa diária “Atualizar radar BTS” do ChatGPT, pela manhã no horário de Brasília. Sem acesso direto às APIs das redes e sem monitoramento em tempo real. Nenhum serviço pago foi ativado.

Cada resultado informa plataforma, veículo/comunidade e tipo (Notícia ou Comunidade). Resultados jornalísticos repetidos são agrupados preservando as origens. Tópicos de fórum não são tratados como notícias confirmadas. Não há conteúdo fictício.

O filtro de plataforma atua sobre todas as origens da matéria agrupada. Filtros adicionais: integrante, período, assunto, termo, palavra-chave no título e novidades desde a consulta anterior neste navegador.

Títulos e trechos das quatro fontes ao vivo permanecem no idioma original. X e Weibo têm títulos e resumos em português. O botão de português abre o Google Tradutor em outra aba; tradução automática dentro do painel ainda não está conectada.

## Rodar

Requer Node.js 22.13 ou superior.

```sh
npm install
npm run dev
```

Produção: `npm run build` e `npm start`. O servidor escuta em 0.0.0.0, na porta 3000 ou PORT. GitHub Pages não executa a API deste aplicativo.

## Operação

Consultas usam concorrência limitada, timeout por fonte, deduplicação de chamadas simultâneas e cache de até cinco minutos por instância. Falhas parciais ficam visíveis no painel; uma fonte indisponível não bloqueia as demais. Contagens por fonte são anteriores ao agrupamento e aos filtros.

Somente páginas públicas são consultadas. Nenhuma credencial é necessária para as quatro fontes integradas. Não há contorno de login ou bloqueios. Mudanças no HTML e restrições da origem podem interromper a coleta. A cobertura não é completa, e os horários e as classificações por palavras-chave são aproximados.

A implantação é direta pela API da Vercel; o vínculo GitHub → Vercel ainda precisa ser configurado na conta para atualizações automáticas.

## Validação

Em 5 de outubro de 2026, a primeira versão na Vercel retornou 48 matérias nas nove consultas do Daum. A expansão foi validada com HTML público real do Naver (10 resultados), TheQoo (20) e Pann (17), além da preservação de origens na deduplicação, TypeScript e build de produção. A validação local não garante a disponibilidade contínua das fontes externas.

## X e Weibo: pesquisa agendada

`data/social-posts.json` contém posts públicos localizados por pesquisa, com resumos autorais em português, autor, plataforma, data de publicação quando confirmada, data de descoberta e nota de evidência. O feed combina esses dados com as quatro fontes já consultadas. Não há cadastro manual pelo usuário nem API paga.

A pesquisa diária é executada pela tarefa “Atualizar radar BTS” do ChatGPT, pela manhã no horário de Brasília, fora da Vercel. A tarefa atualiza o JSON no GitHub e publica uma nova implantação pela conexão Vercel; o site sozinho não pesquisa X/Weibo. O horário `checkedAt` mostra a última pesquisa concluída. Se a tarefa falhar, a seleção anterior permanece. O botão de notícias apenas lê a seleção publicada. Não há promessa de tempo real, cobertura completa ou gratuidade ilimitada fora das cotas existentes.

Preservar datas originais, não confundir data de indexação com publicação, não inventar postagens/resumos. `publishedDate` aceita YYYY-MM-DD ou null (sem data confirmada). Posts sem data confirmada aparecem apenas em Todos os resultados. Para adicionar, usar URL direta HTTPS x.com/usuario/status/id ou weibo.com/usuario/id ou weibo.com/2/detail/id; `accountType` Oficial somente com evidência, senão Comunidade. Não coletar dados privados nem contornar bloqueios. Deduplicar por URL.

A seleção inicial inclui posts antigos, encontrados em 5/10/2026, que não aparecem no filtro inicial de sete dias. Use X ou Weibo e “Incluir posts antigos nos resultados”.
