export const lessons = [
  {
    id:'greet',contentVersion:2,level:'A0',capabilities:['CONNECT','UNDERSTAND'],title:'あいさつを受け、名前を言える',titleEs:'Saludar y decir tu nombre',canDo:'あいさつを受け、名前を聞かれたと分かり、自分の名前を伝える。',
    scene:'初めて会った人が、あなたに笑顔で話しかける。',sceneEs:'Conoces a alguien por primera vez.',
    es:'Hola, me llamo Yusuke.',ja:'こんにちは。ユウスケです。',notice:'<b>me llamo</b> は名前を伝えるまとまり。まずは文法を分解せず、そのまま使う。',noticeEs:'Usa <b>me llamo</b> como un bloque para decir tu nombre.',
    chunk:'Me llamo ___ .',retrieve:'名前を聞かれた。自分の名前をスペイン語で返してみよう。',retrieveCueEs:'Di tu nombre.',retrieveAnswer:'Me llamo Yusuke.',retrieveAnswerJa:'ユウスケです。',
    change:['Me llamo Yusuke.','Me llamo Ana.','Hola, me llamo Yusuke.'],reuse:'次に自己紹介するとき、Hola → Me llamo... を続けて言う。',reuseEs:'La próxima vez, une Hola y Me llamo....',
    partnerPrompt:{es:'Hola, ¿cómo te llamas?',ja:'こんにちは。名前は何ですか？',question:'相手は何を聞いている？',options:['名前','出身地','好きなもの'],correct:0},
    partnerResponse:{es:'Mucho gusto.',ja:'はじめまして。',question:'相手の反応に一番近い意味は？',options:['はじめまして','もう一度お願いします','どこですか'],correct:0,reaction:'Igualmente.'},
    repair:{cue:'聞き取れなかったら、会話を止めずにもう一度お願いする。',phrase:'Otra vez, por favor.',meaning:'もう一度お願いします。'},
    pronunciation:{focus:'CHUNKING',tip:'Me llamo + 名前 を短い一つのまとまりとして声に出す。'},
    transfer:{cue:'相手が「Hola, ¿cómo te llamas?」。今度は自分の本当の名前で返す。',answer:'Me llamo Yusuke.',answerJa:'ユウスケです。'}
  },
  {
    id:'repair',contentVersion:2,level:'A0',capabilities:['REPAIR','SURVIVE','UNDERSTAND'],title:'聞き取れないとき、もう一度頼める',titleEs:'Pedir que repitan',canDo:'聞き取れないとき、黙って止まらず、もう一度言ってもらえる。',
    scene:'相手が短い質問をした。でも、何を言ったか分からなかった。',sceneEs:'Alguien te hace una pregunta, pero no la entiendes.',
    es:'Otra vez, por favor.',ja:'もう一度お願いします。',notice:'全部を理解する必要はない。<b>Otra vez, por favor.</b> は会話を続けるための逃げ道。',noticeEs:'<b>Otra vez, por favor.</b> te ayuda a mantener la conversación cuando no entiendes.',
    chunk:'Otra vez, por favor.',retrieve:'聞き取れなかった。「もう一度お願いします」と言ってみよう。',retrieveCueEs:'Pide que repitan.',retrieveAnswer:'Otra vez, por favor.',retrieveAnswerJa:'もう一度お願いします。',
    change:['Otra vez, por favor.','Más despacio, por favor.','No entiendo.'],reuse:'分からないSpanishに出会ったら、正解を探す前にRepairを一つ使う。',reuseEs:'Cuando no entiendas, usa primero una frase de reparación.',
    partnerPrompt:{es:'¿De dónde eres?',ja:'どこ出身ですか？',question:'今は意味を当てるより、聞き取れなかったとき何をする？',options:['もう一度頼む','適当にYesと言う','会話を終える'],correct:0},
    partnerResponse:{es:'¿De dónde eres?',ja:'どこ出身ですか？（言い直し）',question:'相手はどうしている？',options:['同じ質問を言い直している','別れのあいさつをしている','値段を言っている'],correct:0,reaction:'Soy de Japón.'},
    repair:{cue:'少し聞こえたが速すぎるとき。',phrase:'Más despacio, por favor.',meaning:'もう少しゆっくりお願いします。'},
    pronunciation:{focus:'RHYTHM',tip:'Otra vez // por favor の2つの短いまとまりで言ってみる。'},
    transfer:{cue:'カフェで店員の質問が聞き取れなかった。まず何と言う？',answer:'Otra vez, por favor.',answerJa:'もう一度お願いします。'}
  },
  {
    id:'like',contentVersion:2,level:'A0',capabilities:['CONNECT','EXPRESS','UNDERSTAND'],title:'好きなものを聞かれ、一つ答えられる',titleEs:'Decir una cosa que te gusta',canDo:'好きなものを聞かれたと分かり、自分の好きなものを一つ伝える。',
    scene:'短い雑談で、相手があなたの好きなものを聞く。',sceneEs:'En una charla, te preguntan qué te gusta.',es:'Me gusta el fútbol.',ja:'サッカーが好きです。',
    notice:'<b>Me gusta</b> を「〜が好き」の土台として丸ごと使い、後ろだけ交換する。',noticeEs:'Usa <b>Me gusta</b> como un bloque y cambia solo lo que sigue.',chunk:'Me gusta ___ .',
    retrieve:'「コーヒーが好きです」をスペイン語で。',retrieveCueEs:'Di que te gusta el café.',retrieveAnswer:'Me gusta el café.',retrieveAnswerJa:'コーヒーが好きです。',
    change:['Me gusta el café.','Me gusta la música.','Me gusta viajar.'],reuse:'今日見つけた「好き」を一つ、Me gusta... に差し替える。',reuseEs:'Hoy, cambia solo una cosa después de Me gusta....',
    partnerPrompt:{es:'¿Qué te gusta?',ja:'何が好きですか？',question:'相手は何を知りたい？',options:['好きなもの','名前','明日の予定'],correct:0},
    partnerResponse:{es:'A mí también.',ja:'私もです。',question:'相手の返答は？',options:['相手も同じものが好き','相手は分からないと言っている','相手は場所を聞いている'],correct:0,reaction:'¡Qué bien!'},
    repair:{cue:'質問を聞き取れなかったら。',phrase:'Otra vez, por favor.',meaning:'もう一度お願いします。'},
    pronunciation:{focus:'CHUNKING',tip:'Me gusta を一つのまとまりにして、その後ろへ好きなものを足す。'},
    transfer:{cue:'音楽ではなく「旅行が好き」と初見条件で言う。',answer:'Me gusta viajar.',answerJa:'旅行が好きです。'}
  },
  {
    id:'want',contentVersion:2,level:'A0',capabilities:['TRANSACT','UNDERSTAND','REPAIR'],title:'カフェで簡単な注文を完了できる',titleEs:'Pedir algo en una cafetería',canDo:'カフェで注文し、「ほかにも？」という短い返答にも反応できる。',
    scene:'カフェで店員が注文を聞きに来た。',sceneEs:'Estás en una cafetería y quieres pedir algo.',
    es:'Quiero un café, por favor.',ja:'コーヒーを一つお願いします。',notice:'<b>Quiero</b> + ほしいもの。<b>por favor</b> を添えると依頼として使いやすい。',noticeEs:'Usa <b>Quiero</b> + lo que quieres y añade <b>por favor</b>.',
    chunk:'Quiero ___, por favor.',retrieve:'「水をお願いします」をスペイン語で。',retrieveCueEs:'Pide agua.',retrieveAnswer:'Quiero agua, por favor.',retrieveAnswerJa:'水をお願いします。',
    change:['Quiero agua, por favor.','Quiero un café, por favor.','Quiero esto, por favor.'],reuse:'別の商品でも Quiero ___, por favor. を再利用する。',reuseEs:'Reutiliza Quiero ___, por favor con otra cosa.',
    partnerPrompt:{es:'¿Qué quieres?',ja:'何がほしいですか？／何にしますか？',question:'店員は何を聞いている？',options:['注文したいもの','名前','出身地'],correct:0},
    partnerResponse:{es:'¿Algo más?',ja:'ほかにも何か？',question:'店員は何を確認している？',options:['追加注文があるか','支払い方法','名前'],correct:0,reaction:'No, gracias.'},
    repair:{cue:'店員の返答が速すぎるとき。',phrase:'Más despacio, por favor.',meaning:'もう少しゆっくりお願いします。'},
    pronunciation:{focus:'STRESS',tip:'Quiero と café の強く聞こえる部分を意識し、全文を均等に強くしない。'},
    transfer:{cue:'別の店で「これをお願いします」。名前を知らない物を指して頼む。',answer:'Quiero esto, por favor.',answerJa:'これをお願いします。'}
  },
  {
    id:'where',contentVersion:2,level:'A1',capabilities:['TRANSACT','UNDERSTAND','REPAIR'],title:'場所を聞き、返答の手がかりを拾える',titleEs:'Preguntar dónde está un lugar',canDo:'場所を聞き、短い返答から「ここ／あそこ」程度の手がかりを拾える。',
    scene:'知らない場所でトイレを探している。',sceneEs:'Buscas el baño en un lugar que no conoces.',
    es:'Perdón, ¿dónde está el baño?',ja:'すみません、トイレはどこですか？',notice:'<b>¿Dónde está...?</b> で場所を聞く。最初の <b>Perdón</b> は相手の注意を引くのに便利。',noticeEs:'Usa <b>¿Dónde está...?</b> para preguntar por un lugar.',
    chunk:'¿Dónde está ___?',retrieve:'「出口はどこですか？」をスペイン語で。',retrieveCueEs:'Pregunta por la salida.',retrieveAnswer:'¿Dónde está la salida?',retrieveAnswerJa:'出口はどこですか？',
    change:['¿Dónde está el baño?','¿Dónde está la salida?','¿Dónde está el hotel?'],reuse:'地図で目についた場所を一つ ¿Dónde está...? にする。',reuseEs:'Elige un lugar en un mapa y pregunta ¿Dónde está...?',
    partnerPrompt:{es:'¿Qué buscas?',ja:'何を探していますか？',question:'相手は何を聞いている？',options:['何を探しているか','何を食べたいか','何歳か'],correct:0},
    partnerResponse:{es:'Está allí.',ja:'あそこです。',question:'場所について何と言っている？',options:['あそこにある','閉まっている','分からない'],correct:0,reaction:'Gracias.'},
    repair:{cue:'相手が指さした場所を確認したいとき。',phrase:'¿Aquí?',meaning:'ここですか？'},
    pronunciation:{focus:'QUESTION INTONATION',tip:'¿Dónde está...? を質問として一まとまりで言う。語尾だけを極端に上げる必要はない。'},
    transfer:{cue:'駅で「出口はどこですか？」。学習例とは違う場所に差し替える。',answer:'¿Dónde está la salida?',answerJa:'出口はどこですか？'}
  },
  {
    id:'from',contentVersion:2,level:'A1',capabilities:['CONNECT','EXPRESS','UNDERSTAND'],title:'出身を聞かれ、答えられる',titleEs:'Decir de dónde eres',canDo:'出身を聞かれたと分かり、自分の出身地や国を伝える。',
    scene:'自己紹介の続きで、相手が出身を聞く。',sceneEs:'En una presentación, te preguntan de dónde eres.',
    es:'Soy de Japón.',ja:'日本出身です。',notice:'<b>Soy de</b> + 場所で「〜出身です」。',noticeEs:'Usa <b>Soy de</b> + lugar para decir de dónde eres.',chunk:'Soy de ___ .',
    retrieve:'「東京出身です」をスペイン語で。',retrieveCueEs:'Di que eres de Tokio.',retrieveAnswer:'Soy de Tokio.',retrieveAnswerJa:'東京出身です。',change:['Soy de Tokio.','Soy de Japón.','Soy de Saitama.'],
    reuse:'Me llamo... と Soy de... を続け、2つのChunkを組み合わせる。',reuseEs:'Une Me llamo... y Soy de....',
    partnerPrompt:{es:'¿De dónde eres?',ja:'どこ出身ですか？',question:'相手は何を聞いている？',options:['出身','名前','値段'],correct:0},
    partnerResponse:{es:'Ah, Japón.',ja:'ああ、日本。',question:'相手は何をしている？',options:['あなたの答えを受け止めている','もう一度質問している','注文している'],correct:0,reaction:'Sí.'},
    repair:{cue:'質問を聞き取れなかったら。',phrase:'Otra vez, por favor.',meaning:'もう一度お願いします。'},
    pronunciation:{focus:'RHYTHM',tip:'Soy de Japón. を短い一つの発話単位として言う。'},
    transfer:{cue:'国ではなく「埼玉出身です」と答える。',answer:'Soy de Saitama.',answerJa:'埼玉出身です。'}
  },
  {
    id:'today',contentVersion:2,level:'A1',capabilities:['CONNECT','EXPRESS','UNDERSTAND'],title:'今の状態を聞かれ、短く返せる',titleEs:'Decir cómo estás hoy',canDo:'「元気？」と聞かれたと分かり、今の状態を短く伝える。',
    scene:'友人が会ってすぐ、あなたの状態を聞く。',sceneEs:'Un amigo te pregunta cómo estás.',
    es:'Estoy un poco cansado.',ja:'少し疲れています。',notice:'今の状態は <b>Estoy...</b> を土台にすると作りやすい。',noticeEs:'Usa <b>Estoy...</b> para decir cómo estás ahora.',chunk:'Estoy ___ .',
    retrieve:'「元気です」をスペイン語で。',retrieveCueEs:'Di que estás bien.',retrieveAnswer:'Estoy bien.',retrieveAnswerJa:'元気です。',change:['Estoy bien.','Estoy feliz.','Estoy un poco cansado.'],
    reuse:'夜に、その日の状態を Estoy... で一つ言う。',reuseEs:'Por la noche, describe tu estado con Estoy....',
    partnerPrompt:{es:'¿Cómo estás?',ja:'元気ですか？／調子はどう？',question:'相手は何を聞いている？',options:['今の状態','出身','場所'],correct:0},
    partnerResponse:{es:'Qué bien.',ja:'それはよかった。',question:'相手の反応は？',options:['よかったね、と反応している','値段を言っている','道を説明している'],correct:0,reaction:'Gracias.'},
    repair:{cue:'聞こえなかったら。',phrase:'Otra vez, por favor.',meaning:'もう一度お願いします。'},
    pronunciation:{focus:'VOWELS',tip:'Spanishの母音は曖昧にしすぎず、Estoy の o まで意識して聞く。'},
    transfer:{cue:'今日は「少し疲れています」と自分の状態へ変える。',answer:'Estoy un poco cansado.',answerJa:'少し疲れています。'}
  },
  {
    id:'time',contentVersion:2,level:'A1',capabilities:['EXPRESS','UNDERSTAND'],title:'明日の予定を聞かれ、一つ答えられる',titleEs:'Hablar de un plan sencillo',canDo:'明日の予定を聞かれたと分かり、一つの行動を短く伝える。',
    scene:'友人が明日の予定を聞く。',sceneEs:'Un amigo te pregunta por tu plan de mañana.',
    es:'Mañana trabajo.',ja:'明日は仕事です。',notice:'時間語 <b>Mañana</b> を先に置くと、短い予定を作りやすい。',noticeEs:'Pon <b>Mañana</b> delante de una acción para hablar de mañana.',chunk:'Mañana ___ .',
    retrieve:'「明日は勉強します」をスペイン語で。',retrieveCueEs:'Di que mañana estudias.',retrieveAnswer:'Mañana estudio.',retrieveAnswerJa:'明日は勉強します。',change:['Mañana estudio.','Mañana descanso.','Mañana trabajo.'],
    reuse:'寝る前に Mañana... で明日を一つ言う。',reuseEs:'Antes de dormir, di un plan con Mañana....',
    partnerPrompt:{es:'¿Qué haces mañana?',ja:'明日は何をしますか？',question:'相手は何を聞いている？',options:['明日の予定','今いる場所','好きなもの'],correct:0},
    partnerResponse:{es:'Vale.',ja:'わかった／OK。',question:'相手の反応は？',options:['了解している','聞き返している','怒っている'],correct:0,reaction:'Sí.'},
    repair:{cue:'質問が速かったら。',phrase:'Más despacio, por favor.',meaning:'もう少しゆっくりお願いします。'},
    pronunciation:{focus:'STRESS',tip:'mañana は中央の ña に強勢があることを意識して聞く。'},
    transfer:{cue:'「明日は休みます」と、別の行動へ差し替える。',answer:'Mañana descanso.',answerJa:'明日は休みます。'}
  },
  {
    id:'opinion',contentVersion:2,level:'A1',capabilities:['EXPRESS','UNDERSTAND'],title:'簡単な感想を聞かれ、一言返せる',titleEs:'Dar una opinión breve',canDo:'食事や体験について感想を聞かれ、短い評価を返せる。',
    scene:'食事のあと、相手が感想を聞く。',sceneEs:'Después de comer, te preguntan qué te parece.',
    es:'Está muy rico.',ja:'とてもおいしいです。',notice:'<b>Está...</b> で、今目の前にあるものを短く評価できる。',noticeEs:'Con <b>Está...</b> puedes dar una valoración breve.',chunk:'Está muy ___ .',
    retrieve:'「とてもいいです」をスペイン語で。',retrieveCueEs:'Di que está muy bien.',retrieveAnswer:'Está muy bien.',retrieveAnswerJa:'とてもいいです。',change:['Está muy bien.','Está muy rico.','Está muy interesante.'],
    reuse:'今日触れたもの一つを Está muy... で評価する。',reuseEs:'Hoy, valora una cosa con Está muy....',
    partnerPrompt:{es:'¿Qué tal?',ja:'どう？／どうだった？',question:'相手は何を求めている？',options:['短い感想','名前','道案内'],correct:0},
    partnerResponse:{es:'Sí, está muy bien.',ja:'うん、とてもいいね。',question:'相手はどう反応している？',options:['同意している','聞き取れないと言っている','別れようとしている'],correct:0,reaction:'Sí.'},
    repair:{cue:'質問の意味が分からなかったら。',phrase:'No entiendo.',meaning:'分かりません。'},
    pronunciation:{focus:'INTONATION',tip:'¿Qué tal? の短い質問と、Está muy bien. の言い切りの違いを聞く。'},
    transfer:{cue:'食事ではなく「とても面白いです」と別の体験を評価する。',answer:'Está muy interesante.',answerJa:'とても面白いです。'}
  }
];

export const discoveryItems = [
  {type:'WORD',title:'sobremesa',word:'sobremesa',body:'食後、席を立たずに会話を楽しむ時間。日本語の一語訳にしにくい、生活文化ごとの語彙。',tag:'文化と言葉'},
  {type:'CHUNK',title:'「少しずつ」',word:'poco a poco',body:'「少しずつ」「徐々に」。学習にも日常にも使える。Voy aprendiendo poco a poco. なら「少しずつ覚えています」。',tag:'使える表現'},
  {type:'REPAIR',title:'分からなくても会話は続けられる',word:'Otra vez, por favor.',body:'全部を聞き取るより先に、聞き返せることが会話の安全網になる。Poco a PocoではRepairも独立した能力として扱う。',tag:'会話を続ける'},
  {type:'NOTICE',title:'¿ の向きには理由がある',word:'¿Por qué?',body:'スペイン語は疑問文の始まりにも記号を置く。長い文でも、読む側が最初から「質問」と分かる。',tag:'文字の仕組み'},
  {type:'CULTURE',title:'tú と usted',word:'¿Cómo está?',body:'距離感によって「あなた」の形が変わる。まずは表現を丸ごと覚え、文法説明は必要になったときに足す。',tag:'距離感'},
  {type:'SOUND',title:'文は音のまとまりでもある',word:'Me llamo Pedro.',body:'発音は一音ずつ完璧にするより、短い発話をまとまりで聞き、まとまりで言うところから始める。',tag:'音とリズム'},
  {type:'PATTERN',title:'同じ型を使い回す',word:'Me gusta ___',body:'fútbol / café / viajar。ひとつの型に自分の語彙を差し替えるだけで、話せる範囲はすぐ広がる。',tag:'再利用'}
];
