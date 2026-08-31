export const lessons = [
  {
    id:'greet',level:'A0',title:'あいさつして、名前を言える',titleEs:'Saludar y decir tu nombre',canDo:'会った人にあいさつし、自分の名前を伝える。',
    scene:'初めて会った人と、短くあいさつする。',sceneEs:'Conoces a alguien por primera vez.',
    es:'Hola, me llamo Yusuke.',ja:'こんにちは。ユウスケです。',
    notice:'<b>me llamo</b> は「私は〜という名前です」のまとまり。単語ごとより、ひとかたまりで。',noticeEs:'Usa <b>me llamo</b> como un bloque para decir tu nombre.',
    chunk:'Me llamo ___ .',retrieve:'「私はユウスケです」を、スペイン語で思い出してみよう。',retrieveCueEs:'Preséntate: saluda y di tu nombre.',
    retrieveAnswer:'Hola, me llamo Yusuke.',retrieveAnswerJa:'こんにちは。ユウスケです。',change:['Me llamo Ana.','Me llamo Ken.','Me llamo María.'],
    reuse:'明日、最初の30秒で名前を声に出してもう一度。',reuseEs:'Mañana, di tu nombre otra vez en los primeros 30 segundos.'
  },
  {
    id:'like',level:'A0',title:'好きなものを一つ言える',titleEs:'Decir una cosa que te gusta',canDo:'好きな食べ物やことを一つ伝える。',
    scene:'雑談で「何が好き？」と聞かれた。',sceneEs:'En una charla, te preguntan qué te gusta.',es:'Me gusta el fútbol.',ja:'私はサッカーが好きです。',
    notice:'<b>Me gusta</b> を「私は〜が好き」として丸ごと使う。',noticeEs:'Usa <b>Me gusta</b> como un bloque y cambia solo lo que sigue.',chunk:'Me gusta ___ .',
    retrieve:'「私はコーヒーが好きです」をスペイン語で言ってみよう。',retrieveCueEs:'Di que te gusta el café.',retrieveAnswer:'Me gusta el café.',retrieveAnswerJa:'私はコーヒーが好きです。',
    change:['Me gusta el café.','Me gusta la música.','Me gusta viajar.'],reuse:'今日見つけた「好き」を一つ、Me gusta で言う。',reuseEs:'Hoy, elige una cosa que te guste y dilo con Me gusta.'
  },
  {
    id:'want',level:'A0',title:'ほしいものを言える',titleEs:'Pedir lo que quieres',canDo:'店や食事で、ほしいものを簡単に伝える。',scene:'カフェで注文したい。',sceneEs:'Quieres pedir algo en una cafetería.',
    es:'Quiero un café, por favor.',ja:'コーヒーを一つお願いします。',notice:'<b>Quiero</b> は「ほしい／〜したい」。por favor を足すと柔らかい。',noticeEs:'<b>Quiero</b> expresa lo que quieres; <b>por favor</b> suaviza la petición.',
    chunk:'Quiero ___, por favor.',retrieve:'「水をお願いします」をスペイン語で言ってみよう。',retrieveCueEs:'Pide agua, por favor.',retrieveAnswer:'Quiero agua, por favor.',retrieveAnswerJa:'水をお願いします。',
    change:['Quiero agua, por favor.','Quiero esto, por favor.','Quiero comer.'],reuse:'飲み物を取るとき心の中で Quiero ___ と言う。',reuseEs:'Cuando tomes una bebida, piensa: Quiero ___.'
  },
  {
    id:'where',level:'A1',title:'場所をたずねられる',titleEs:'Preguntar dónde está un lugar',canDo:'駅やトイレなど、場所を簡単に聞ける。',scene:'知らない場所で目的地を探している。',sceneEs:'Buscas un lugar que no conoces.',
    es:'¿Dónde está la estación?',ja:'駅はどこですか？',notice:'<b>¿Dónde está...?</b> で「〜はどこ？」。場所の名詞を差し替える。',noticeEs:'Usa <b>¿Dónde está...?</b> y cambia solo el lugar.',
    chunk:'¿Dónde está ___?',retrieve:'「トイレはどこですか？」をスペイン語で。',retrieveCueEs:'Pregunta dónde está el baño.',retrieveAnswer:'¿Dónde está el baño?',retrieveAnswerJa:'トイレはどこですか？',
    change:['¿Dónde está el baño?','¿Dónde está el hotel?','¿Dónde está la salida?'],reuse:'地図を開いたら、目についた場所を ¿Dónde está...? にする。',reuseEs:'Cuando mires un mapa, elige un lugar y pregunta: ¿Dónde está...?'
  },
  {
    id:'from',level:'A1',title:'出身を言える',titleEs:'Decir de dónde eres',canDo:'自分の出身地や国を伝える。',scene:'旅行先で「どこから来たの？」と聞かれた。',sceneEs:'Te preguntan de dónde eres.',
    es:'Soy de Japón.',ja:'日本出身です。',notice:'<b>Soy de</b> + 場所で「〜出身です」。',noticeEs:'Usa <b>Soy de</b> + lugar para decir de dónde eres.',chunk:'Soy de ___ .',
    retrieve:'「東京出身です」をスペイン語で。',retrieveCueEs:'Di que eres de Tokio.',retrieveAnswer:'Soy de Tokio.',retrieveAnswerJa:'東京出身です。',change:['Soy de Tokio.','Soy de Japón.','Soy de Saitama.'],
    reuse:'自己紹介で Me llamo... と Soy de... を続ける。',reuseEs:'En tu presentación, une Me llamo... y Soy de....'
  },
  {
    id:'today',level:'A1',title:'今日の状態を言える',titleEs:'Decir cómo estás hoy',canDo:'今の気分や状態を短く伝える。',scene:'友人に「元気？」と聞かれた。',sceneEs:'Un amigo te pregunta cómo estás.',
    es:'Estoy un poco cansado.',ja:'少し疲れています。',notice:'状態は <b>Estoy...</b> で始めると作りやすい。',noticeEs:'Usa <b>Estoy...</b> para decir cómo estás ahora.',chunk:'Estoy ___ .',
    retrieve:'「元気です」をスペイン語で言ってみよう。',retrieveCueEs:'Di que estás bien.',retrieveAnswer:'Estoy bien.',retrieveAnswerJa:'元気です。',change:['Estoy bien.','Estoy feliz.','Estoy aquí.'],
    reuse:'夜に今日の状態を Estoy... で一言。',reuseEs:'Por la noche, describe tu estado con una frase: Estoy....'
  },
  {
    id:'time',level:'A1',title:'簡単な予定を言える',titleEs:'Hablar de un plan sencillo',canDo:'今日・明日の簡単な予定を伝える。',scene:'明日の予定を友人に伝える。',sceneEs:'Le cuentas a alguien tu plan de mañana.',
    es:'Mañana trabajo.',ja:'明日は仕事です。',notice:'時間語 <b>Mañana</b> を先に置くだけでも、短い予定が作れる。',noticeEs:'Pon <b>Mañana</b> delante de una acción para hablar de mañana.',chunk:'Mañana ___ .',
    retrieve:'「明日は勉強します」をスペイン語で。',retrieveCueEs:'Di que mañana estudias.',retrieveAnswer:'Mañana estudio.',retrieveAnswerJa:'明日は勉強します。',change:['Mañana estudio.','Mañana descanso.','Mañana viajo.'],
    reuse:'寝る前に Mañana... で明日を一つ言う。',reuseEs:'Antes de dormir, di un plan de mañana con Mañana....'
  },
  {
    id:'opinion',level:'A1+',title:'簡単な感想を言える',titleEs:'Dar una opinión breve',canDo:'見たもの・食べたものに短い感想を返す。',scene:'食事の感想を聞かれた。',sceneEs:'Te preguntan qué te parece la comida.',
    es:'Está muy rico.',ja:'とてもおいしいです。',notice:'<b>Está...</b> を使うと「今それが〜な状態」と短く評価できる。',noticeEs:'Con <b>Está...</b> puedes dar una valoración breve de algo.',chunk:'Está muy ___ .',
    retrieve:'「とてもいいです」をスペイン語で。',retrieveCueEs:'Di que está muy bien.',retrieveAnswer:'Está muy bien.',retrieveAnswerJa:'とてもいいです。',change:['Está muy bien.','Está muy rico.','Está muy interesante.'],
    reuse:'今日触れたもの一つを Está muy... で評価する。',reuseEs:'Hoy, elige una cosa y valórala con Está muy....'
  }
];

export const discoveryItems = [
  {type:'WORD',title:'sobremesa',word:'sobremesa',body:'食後、席を立たずに会話を楽しむ時間。日本語の一語訳にしにくい、生活文化ごとの語彙。',tag:'文化と言葉'},
  {type:'CHUNK',title:'「少しずつ」',word:'poco a poco',body:'「少しずつ」「徐々に」。学習にも日常にも使える。Voy aprendiendo poco a poco. なら「少しずつ覚えています」。',tag:'使える表現'},
  {type:'NOTICE',title:'¿ の向きには理由がある',word:'¿Por qué?',body:'スペイン語は疑問文の始まりにも記号を置く。長い文でも、読む側が最初から「質問」と分かる。',tag:'文字の仕組み'},
  {type:'CULTURE',title:'tú と usted',word:'¿Cómo está?',body:'距離感によって「あなた」の形が変わる。まずは表現を丸ごと覚え、文法説明は必要になったときに足す。',tag:'距離感'},
  {type:'SOUND',title:'j は日本語の「ハ」より強め',word:'Japón',body:'j は喉の奥で摩擦を作る音。完璧な採点より、まず音の違いに気づく。',tag:'音'},
  {type:'PATTERN',title:'同じ型を使い回す',word:'Me gusta ___',body:'fútbol / café / viajar。ひとつの型に自分の語彙を差し替えるだけで、話せる範囲はすぐ広がる。',tag:'再利用'}
];
