var hbs = require('hbs');
var fs = require('fs');
var _ = require('underscore');

var express = require('express'),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
    jogadores: JSON.parse(fs.readFileSync('server/data/jogadores.json')).players,
    jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))

};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.get('/', function (request, response) {
    response.render('index', {
        jogadores: db.jogadores
    });
});
// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:id', function (request, response) {
    var jogador = _.findWhere(db.jogadores, { steamid: request.params.id });

    var jogosPJogador = db.jogosPorJogador[request.params.id];
    jogador.qntjogos = jogosPJogador.game_count;
    var todosJogos = jogosPJogador.games;
    var njogado = _.where(jogosPJogador, { playtime_forever: 0 });
    jogador.qntnjogados = njogado.length;

    todosJogos.forEach(function (j) {
        j.mprah = Math.ceil(j.playtime_forever / 60);
    });

    var best = _.sortBy(todosJogos, function (j) {
        return -j.playtime_forever;
    });

    jogador.principal = _.first(best, 1)[0];
    jogador.top5 = _.first(best, 5);
    response.render('jogador', {
        jogador: jogador
    });
});
// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client'));
// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});