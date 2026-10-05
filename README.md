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

Títulos e trechos das quatro fontes ao vivo permanecem no idioma original. X e Weibo têm títulos e resumos em português. A integração Gemini traduz títulos e trechos dentro do painel quando GEMINI_API_KEY estiver configurada. Sem chave/cota, preserva os originais.

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

## Tradução Gemini

Configure GEMINI_API_KEY como variável sensível de Production na Vercel e publique novamente. Use uma chave de projeto Google AI Studio no Free Tier, com faturamento desativado; não ativar billing. GEMINI_MODEL é opcional e usa gemini-3.5-flash-lite por padrão. A chave nunca usa prefixo NEXT_PUBLIC e nunca é enviada ao navegador nem commitada. O site envia somente títulos/trechos públicos de suas próprias fontes, não textos arbitrários do visitante. No Free Tier, o provedor pode usar conteúdo para melhorar seus produtos.

A tradução preserva URLs, fontes, datas e classificação. Português é o padrão, com controle Mostrar textos originais e identificação de tradução automática. Posts curatoriais já em português não são traduzidos novamente. Falhas, ausência de chave ou cota encerrada mantêm o conteúdo original com aviso. Não há fallback para modelo pago. Um projeto Gemini com billing ativo pode gerar cobranças: o aplicativo não consegue determinar sozinho a modalidade de faturamento da chave.

Lotes de 20, no máximo duas chamadas simultâneas, timeout de 12 segundos, orçamento de tempo até 54 segundos desde a coleta, cooldown de 30 minutos após HTTP 429. Lotes válidos são reutilizados no Data Cache do Next por sete dias e em cache limitado por artigo por instância; alterações nos textos geram novas entradas. O cache pode ser descartado pela plataforma, então não garante consumo zero em repetições. O botão consulta a API com cache de cinco minutos.
