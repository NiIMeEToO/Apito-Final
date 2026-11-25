(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var root=document.documentElement;
  function store(k,v){try{if(v===undefined){return localStorage.getItem(k)}localStorage.setItem(k,v)}catch(e){return null}}

  /* ---------- Torcida (arte do slide 4) ---------- */
  var crowd=$('#crowd'),cols=['#F2C200','#fff','#4FCB84','#8CB4FF','#E4572E'],h='';
  for(var r=0;r<9;r++){for(var c=0;c<40;c++){var x=10+c*20+(r%2)*8,y=20+r*27;h+='<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+cols[(c*7+r*3)%cols.length]+'" opacity=".9"/>'}}
  crowd.innerHTML=h;

  /* ---------- Acessibilidade ---------- */
  var st={theme:store('af-theme')||'system',scale:parseFloat(store('af-scale'))||1,contrast:store('af-contrast')==='1',spacing:store('af-spacing')==='1',motion:store('af-motion')==='1'};
  function apply(){
    if(st.theme==='system')root.removeAttribute('data-theme');else root.setAttribute('data-theme',st.theme);
    root.style.setProperty('--scale',st.scale);
    if(st.contrast)root.setAttribute('data-contrast','high');else root.removeAttribute('data-contrast');
    root.style.setProperty('--ls',st.spacing?'.04em':'0');root.style.setProperty('--ws',st.spacing?'.12em':'0');
    document.body.style.lineHeight=st.spacing?'1.9':'';
    if(st.motion)root.setAttribute('data-motion','off');else root.removeAttribute('data-motion');
    $$('[data-theme-set]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.themeSet===st.theme)});
    $('#sizeOut').textContent=Math.round(st.scale*100)+'%';
    $('#optContrast').checked=st.contrast;$('#optSpacing').checked=st.spacing;$('#optMotion').checked=st.motion;
    store('af-theme',st.theme);store('af-scale',String(st.scale));store('af-contrast',st.contrast?'1':'0');store('af-spacing',st.spacing?'1':'0');store('af-motion',st.motion?'1':'0');
    syncAuto();requestAnimationFrame(renderContrast);
  }
  var panel=$('#a11yPanel'),tg=$('#a11yToggle');
  function openPanel(o){panel.hidden=!o;tg.setAttribute('aria-expanded',o)}
  tg.addEventListener('click',function(){openPanel(panel.hidden)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){openPanel(false);tg.focus()}});
  document.addEventListener('click',function(e){if(!panel.hidden&&!panel.contains(e.target)&&e.target!==tg)openPanel(false)});
  $$('[data-theme-set]').forEach(function(b){b.addEventListener('click',function(){st.theme=b.dataset.themeSet;apply()})});
  $('#sizeUp').addEventListener('click',function(){st.scale=Math.min(1.5,Math.round((st.scale+.1)*10)/10);apply()});
  $('#sizeDown').addEventListener('click',function(){st.scale=Math.max(.8,Math.round((st.scale-.1)*10)/10);apply()});
  $('#sizeReset').addEventListener('click',function(){st.scale=1;apply()});
  $('#optContrast').addEventListener('change',function(e){st.contrast=e.target.checked;apply()});
  $('#optSpacing').addEventListener('change',function(e){st.spacing=e.target.checked;apply()});
  $('#optMotion').addEventListener('change',function(e){st.motion=e.target.checked;apply()});
  $('#a11yReset').addEventListener('click',function(){st={theme:'system',scale:1,contrast:false,spacing:false,motion:false};apply()});
  $('#a11yLink').addEventListener('click',function(){openPanel(false)});
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  (mq.addEventListener?mq.addEventListener('change',function(){requestAnimationFrame(renderContrast)}):0);

  /* ---------- Contraste (WCAG 2.x) ---------- */
  function lum(rgb){var a=rgb.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}
  function toRGB(css){var p=document.createElement('span');p.style.color=css;document.body.appendChild(p);var c=getComputedStyle(p).color;document.body.removeChild(p);var m=c.match(/[\d.]+/g);return m.slice(0,3).map(Number)}
  function ratio(a,b){var l1=lum(a),l2=lum(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+.05)/(lo+.05)}
  var pairs=[['Texto principal sobre fundo','--fg','--bg'],['Texto secundário sobre fundo','--muted','--bg'],['Texto secundário sobre cartão','--muted','--surface'],['Texto de botão primário','--pitch-fg','--pitch'],['Verde de destaque (links) sobre fundo','--pitch','--bg'],['Texto do cartão amarelo','--card-fg','--card'],['Mensagem de erro sobre fundo','--danger','--bg'],['Anel de foco sobre fundo','--focus','--bg']];
  function renderContrast(){
    var body=$('#contrastBody');if(!body)return;
    var cs=getComputedStyle(root);
    body.innerHTML=pairs.map(function(p){
      var f=toRGB('var('+p[1]+')'),b=toRGB('var('+p[2]+')'),r=ratio(f,b);
      var aa=r>=4.5,aaa=r>=7;
      return '<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-size:1rem;color:inherit">'+p[0]+'</th>'+
        '<td><span class="sw" style="color:var('+p[1]+');background:var('+p[2]+')">Aa</span></td>'+
        '<td class="num">'+r.toFixed(2).replace('.',',')+':1</td>'+
        '<td class="'+(aa?'pass':'fail')+'">'+(aa?'Passa':'Falha')+'</td>'+
        '<td class="'+(aaa?'pass':'fail')+'">'+(aaa?'Passa':'Não')+'</td></tr>';
    }).join('');
  }

  /* ---------- Dados ---------- */
  var data={
    jogadores:[
      {n:'Pelé',s:'Atacante · Santos',t:'Campeão em 1958, 1962 e 1970',d:'Único jogador a vencer três Copas do Mundo. Fez seu primeiro gol em Copa aos 17 anos.'},
      {n:'Marta',s:'Atacante · Seleção Brasileira',t:'6 vezes melhor do mundo',d:'Eleita melhor jogadora do mundo pela FIFA de 2006 a 2010 e em 2018. Maior artilheira da história das Copas Femininas.'},
      {n:'Ronaldo',s:'Atacante · Inter, Barcelona, Real Madrid',t:'Pentacampeão em 2002',d:'Artilheiro da Copa de 2002 com 8 gols e dono de 15 gols em Copas, recorde brasileiro.'},
      {n:'Garrincha',s:'Ponta-direita · Botafogo',t:'Campeão em 1958 e 1962',d:'Driblador lendário. Na Copa de 1962, assumiu o protagonismo após a lesão de Pelé.'},
      {n:'Cafu',s:'Lateral-direito · Roma, Milan',t:'Capitão do penta',d:'Disputou três finais seguidas de Copa (1994, 1998, 2002) e ergueu a taça em 2002.'},
      {n:'Formiga',s:'Meio-campista · Seleção Brasileira',t:'7 Copas do Mundo',d:'Jogou sete edições da Copa do Mundo Feminina, entre 1995 e 2019.'},
      {n:'Lionel Messi',s:'Atacante · Barcelona, PSG, Inter Miami',t:'Campeão em 2022',d:'Levou a Argentina ao título no Catar e foi eleito melhor jogador do torneio.'},
      {n:'Zico',s:'Meia · Flamengo',t:'Ídolo rubro-negro',d:'Principal craque do Flamengo campeão da Libertadores e do Mundial de 1981.'},
      {n:'Taffarel',s:'Goleiro · Internacional, Parma',t:'Campeão em 1994',d:'Goleiro do tetra. Na semifinal de 1998, defendeu dois pênaltis contra a Holanda.'},
      {n:'Neymar',s:'Atacante · Santos, Barcelona, PSG',t:'Maior artilheiro da seleção masculina',d:'Passou os 77 gols de Pelé pela seleção em 2023. Campeão olímpico em 2016.'}
    ],
    clubes:[
      {n:'Flamengo',s:'Rio de Janeiro · fundado em 1895',t:'Libertadores: 1981, 2019, 2022',d:'Campeão mundial em 1981. Tem uma das maiores torcidas do país.'},
      {n:'Corinthians',s:'São Paulo · fundado em 1910',t:'Mundial: 2000 e 2012',d:'Venceu o primeiro Mundial de Clubes da FIFA, em 2000, disputado no Brasil.'},
      {n:'Palmeiras',s:'São Paulo · fundado em 1914',t:'Libertadores: 1999, 2020, 2021',d:'Bicampeão seguido da Libertadores em 2020 e 2021.'},
      {n:'Santos',s:'Santos · fundado em 1912',t:'Libertadores: 1962, 1963, 2011',d:'Clube de Pelé. Bicampeão mundial em 1962 e 1963.'},
      {n:'São Paulo',s:'São Paulo · fundado em 1930',t:'Libertadores: 1992, 1993, 2005',d:'Tricampeão da Libertadores e três vezes campeão mundial.'},
      {n:'Grêmio',s:'Porto Alegre · fundado em 1903',t:'Libertadores: 1983, 1995, 2017',d:'Campeão mundial em 1983, com gol de Renato Gaúcho.'},
      {n:'Real Madrid',s:'Madri, Espanha · fundado em 1902',t:'Recordista da Liga dos Campeões',d:'É o clube com mais títulos da principal competição europeia.'},
      {n:'Barcelona',s:'Barcelona, Espanha · fundado em 1899',t:'Clube de Messi por 17 anos',d:'Messi estreou no time principal em 2004 e saiu em 2021.'},
      {n:'Boca Juniors',s:'Buenos Aires, Argentina · fundado em 1905',t:'Libertadores: 6 títulos',d:'Um dos maiores campeões da Libertadores, com a torcida da La Bombonera.'}
    ],
    copas:[
      {n:'1930 · Uruguai',s:'Primeira Copa',t:'Campeão: Uruguai',d:'Treze seleções disputaram. O Uruguai venceu a Argentina na final, em Montevidéu.'},
      {n:'1950 · Brasil',s:'Maracanã',t:'Campeão: Uruguai',d:'O “Maracanazo”: o Uruguai virou o jogo contra o Brasil diante de quase 200 mil pessoas, segundo registros da época.'},
      {n:'1958 · Suécia',s:'Primeiro título do Brasil',t:'Campeão: Brasil',d:'Pelé tinha 17 anos. O Brasil bateu a Suécia por 5 a 2 na final.'},
      {n:'1970 · México',s:'Tri brasileiro',t:'Campeão: Brasil',d:'Brasil 4 × 1 Itália. O Brasil ficou com a taça Jules Rimet definitivamente.'},
      {n:'1994 · Estados Unidos',s:'Tetra',t:'Campeão: Brasil',d:'Primeira final decidida nos pênaltis. Brasil 0 (3) × (2) 0 Itália.'},
      {n:'2002 · Coreia e Japão',s:'Penta',t:'Campeão: Brasil',d:'Brasil 2 × 0 Alemanha, com dois gols de Ronaldo.'},
      {n:'2014 · Brasil',s:'Copa em casa',t:'Campeã: Alemanha',d:'A Alemanha venceu o Brasil por 7 a 1 na semifinal, em Belo Horizonte.'},
      {n:'2022 · Catar',s:'Primeira Copa no Oriente Médio',t:'Campeã: Argentina',d:'Final de 3 a 3 contra a França e vitória argentina nos pênaltis.'}
    ]
  };
  var favs=[];try{favs=JSON.parse(store('af-favs')||'[]')}catch(e){favs=[]}
  function key(k,n){return k+':'+n}
  function cardHtml(k,it){
    var f=favs.indexOf(key(k,it.n))>-1,tag={jogadores:'Jogador',clubes:'Clube',copas:'Copa'}[k];
    return '<article class="card"><span class="tag'+(k==='clubes'?' green':'')+'">'+tag+'</span><h3>'+it.n+'</h3><p><strong>'+it.t+'</strong></p><p>'+it.d+'</p>'+
      '<div class="meta"><span>'+it.s+'</span><button type="button" class="fav" data-fk="'+key(k,it.n)+'" aria-pressed="'+f+'" aria-label="Favoritar '+it.n+'">'+(f?'★ Favorito':'☆ Favoritar')+'</button></div></article>';
  }
  function bindFav(scope){
    $$('.fav',scope).forEach(function(b){b.addEventListener('click',function(){
      var k=b.dataset.fk,i=favs.indexOf(k);if(i>-1)favs.splice(i,1);else favs.push(k);
      store('af-favs',JSON.stringify(favs));
      var on=favs.indexOf(k)>-1;b.setAttribute('aria-pressed',on);b.textContent=on?'★ Favorito':'☆ Favoritar';
      $$('.fav[data-fk="'+k.replace(/"/g,'\\"')+'"]').forEach(function(o){o.setAttribute('aria-pressed',on);o.textContent=on?'★ Favorito':'☆ Favoritar'});
      if($('#onlyFav').value==='fav')renderResults();
    })});
  }
  $('#featured').innerHTML=cardHtml('jogadores',data.jogadores[0])+cardHtml('jogadores',data.jogadores[1])+cardHtml('clubes',data.clubes[0])+cardHtml('copas',data.copas[5]);
  bindFav($('#featured'));

  /* ---------- Pesquisa com abas ---------- */
  var kind='jogadores';
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function renderResults(){
    var q=norm($('#q').value.trim()),only=$('#onlyFav').value==='fav';
    var list=data[kind].filter(function(it){
      var hit=!q||norm(it.n+' '+it.s+' '+it.t+' '+it.d).indexOf(q)>-1;
      return hit&&(!only||favs.indexOf(key(kind,it.n))>-1);
    });
    var g=$('#resGrid');
    g.innerHTML=list.length?list.map(function(it){return cardHtml(kind,it)}).join(''):'<div class="empty">Nenhum resultado. Tente outra palavra ou limpe o filtro de favoritos.</div>';
    g.style.display=list.length?'':'block';
    $('#count').textContent=list.length+(list.length===1?' resultado':' resultados');
    bindFav(g);
  }
  var tabs=$$('[role=tab]');
  function selectTab(t,focus){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});
    kind=t.dataset.k;$('#resultados').setAttribute('aria-labelledby',t.id);if(focus)t.focus();renderResults();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){selectTab(t)});
    t.addEventListener('keydown',function(e){
      var n=null;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];else if(e.key==='ArrowLeft')n=tabs[(i+tabs.length-1)%tabs.length];else if(e.key==='Home')n=tabs[0];else if(e.key==='End')n=tabs[tabs.length-1];
      if(n){e.preventDefault();selectTab(n,true)}
    });
  });
  $('#q').addEventListener('input',renderResults);$('#onlyFav').addEventListener('change',renderResults);
  renderResults();

  /* ---------- Páginas Times e Jogadores ---------- */
  var posMap={'Ponta-direita':'Atacante','Lateral-direito':'Defensor','Meia':'Meio-campista'};
  function posOf(it){var p=it.s.split(' · ')[0];return posMap[p]||p}
  function regOf(it){return /Espanha|Argentina/.test(it.s)?'Internacional':'Brasil'}
  function setupBrowse(k,prefix,opts,fn){
    var chips=$('#'+prefix+'Chips'),grid=$('#'+prefix+'Grid'),cnt=$('#'+prefix+'Count'),cur='Todos';
    chips.innerHTML=['Todos'].concat(opts).map(function(o){return '<button type="button" class="chip" aria-pressed="'+(o===cur)+'">'+o+'</button>'}).join('');
    function render(){
      var list=data[k].filter(function(it){return cur==='Todos'||fn(it)===cur});
      grid.innerHTML=list.map(function(it){return cardHtml(k,it)}).join('');
      cnt.textContent=list.length+(list.length===1?' item':' itens')+(cur==='Todos'?'':' em “'+cur+'”');
      bindFav(grid);
    }
    $$('.chip',chips).forEach(function(b){b.addEventListener('click',function(){cur=b.textContent;$$('.chip',chips).forEach(function(x){x.setAttribute('aria-pressed',x===b)});render()})});
    render();
  }
  setupBrowse('clubes','times',['Brasil','Internacional'],regOf);
  setupBrowse('jogadores','jog',['Goleiro','Defensor','Meio-campista','Atacante'],posOf);

  /* ---------- Carrossel ---------- */
  var slides=$$('.slide'),idx=0,timer=null,paused=false,track=$('#track'),dots=$('#dots');
  slides.forEach(function(_,i){var b=document.createElement('button');b.className='dot';b.type='button';b.setAttribute('aria-label','Ir para o slide '+(i+1));b.addEventListener('click',function(){go(i)});dots.appendChild(b)});
  function go(i){
    idx=(i+slides.length)%slides.length;track.style.transform='translateX(-'+idx*100+'%)';
    $$('.dot').forEach(function(d,j){d.setAttribute('aria-current',j===idx)});
    slides.forEach(function(s,j){s.setAttribute('aria-hidden',j!==idx);$$('a,button',s).forEach(function(x){x.tabIndex=j===idx?0:-1})});
  }
  function autoplayAllowed(){return !paused&&!st.motion&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
  function syncAuto(){
    clearInterval(timer);timer=null;
    var pp=$('#playPause');if(!pp)return;
    var allowed=autoplayAllowed();
    pp.textContent=allowed?'Pausar':'Reproduzir';pp.setAttribute('aria-pressed',!allowed);
    track.setAttribute('aria-live',allowed?'off':'polite');
    if(allowed)timer=setInterval(function(){go(idx+1)},6000);
  }
  $('#prev').addEventListener('click',function(){go(idx-1)});
  $('#next').addEventListener('click',function(){go(idx+1)});
  $('#playPause').addEventListener('click',function(){
    if(st.motion||window.matchMedia('(prefers-reduced-motion: reduce)').matches){st.motion=false;paused=false;apply();return}
    paused=!paused;syncAuto();
  });
  var car=$('.carousel');
  car.addEventListener('focusin',function(){clearInterval(timer)});
  car.addEventListener('focusout',function(){syncAuto()});
  car.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(idx-1)}else if(e.key==='ArrowRight'){go(idx+1)}});
  var sx=null;car.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  car.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(idx+(dx<0?1:-1));sx=null});
  go(0);

  /* ---------- Formulários ---------- */
  function setErr(input,msgEl,msg){msgEl.textContent=msg;if(msg)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid')}
  var mailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  $('#contactForm').addEventListener('submit',function(e){
    e.preventDefault();var ok=true,first=null;
    var n=$('#cNome'),m=$('#cMail'),g=$('#cMsg');
    function chk(el,err,bad,msg){if(bad){setErr(el,err,msg);ok=false;if(!first)first=el}else setErr(el,err,'')}
    chk(n,$('#eNome'),n.value.trim().length<2,'Informe seu nome com pelo menos 2 letras.');
    chk(m,$('#eMail'),!mailRe.test(m.value.trim()),'Digite um e-mail válido, como nome@exemplo.com.');
    chk(g,$('#eMsg'),g.value.trim().length<10,'Escreva uma mensagem com pelo menos 10 caracteres.');
    var okBox=$('#cOk');
    if(!ok){okBox.hidden=true;first.focus();return}
    okBox.hidden=false;okBox.textContent='Obrigado, '+n.value.trim().split(' ')[0]+'. Sua mensagem passou pela validação. Como este é um projeto de demonstração, ela não foi enviada a ninguém.';
    e.target.reset();
  });
  var user=store('af-user');
  function renderUser(){
    var li=$('#loginLink');
    $('#loginForm').hidden=!!user;$('#logged').hidden=!user;
    if(user){li.textContent=user;$('#loggedName').textContent='Olá, '+user}else li.textContent='Entrar';
  }
  $('#loginForm').addEventListener('submit',function(e){
    e.preventDefault();var m=$('#lMail'),p=$('#lPass'),ok=true,first=null;
    if(!mailRe.test(m.value.trim())){setErr(m,$('#eLMail'),'Digite um e-mail válido.');ok=false;first=m}else setErr(m,$('#eLMail'),'');
    if(p.value.length<6){setErr(p,$('#eLPass'),'A senha precisa ter 6 ou mais caracteres.');ok=false;first=first||p}else setErr(p,$('#eLPass'),'');
    if(!ok){first.focus();return}
    var nm=m.value.split('@')[0];user=nm.charAt(0).toUpperCase()+nm.slice(1);store('af-user',user);p.value='';renderUser();$('#logout').focus();
  });
  $('#logout').addEventListener('click',function(){user=null;try{localStorage.removeItem('af-user')}catch(e){}renderUser();$('#lMail').focus()});
  $('#showPass').addEventListener('click',function(){var p=$('#lPass'),on=p.type==='password';p.type=on?'text':'password';this.textContent=on?'Ocultar':'Mostrar';this.setAttribute('aria-pressed',on)});

  /* ---------- Rotas por hash ---------- */
  var titles={inicio:'Início',times:'Times',jogadores:'Jogadores',pesquisa:'Pesquisa',contato:'Contato',login:'Entrar',acessibilidade:'Contraste das cores'};
  function route(){
    var h=(location.hash||'#inicio').slice(1);if(!titles[h])h='inicio';
    $$('.view').forEach(function(v){v.hidden=v.id!=='v-'+h});
    $$('[data-nav]').forEach(function(a){if(a.dataset.nav===h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    document.title='Apito Final · '+titles[h];
    if(h==='acessibilidade')renderContrast();
  }
  window.addEventListener('hashchange',function(){route();window.scrollTo(0,0);$('#conteudo').focus({preventScroll:true})});
  renderUser();apply();route();
})();
