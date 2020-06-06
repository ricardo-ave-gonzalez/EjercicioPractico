var numJugador = 1;
var numComputador = 1;


//CLASS
function Carta(codigo, textoImagen, tipoCategoria, tipoContenido){
    this.codigo = codigo;
    this.textoImagen = textoImagen;
    this.tipoCategoria = tipoCategoria;
    this.tipoContenido = tipoContenido;
    this.dueno = null;
}

//CLASS
function Tablero(numParesCartas, categoriaDeCartas, numJugadores, numRobots) {  
    this.coloresDeJugadores = ["red", "blue", "green"];
    this.coloresDeRobots = ["brown", "orange", "aqua" ] 
    this.jugadores = [];
    this.audioVoltear = document.getElementById('audio-voltear');

    for(var i = 0; i < numJugadores; i++){
        this.jugadores.push(jugador = new Jugador("h", this.coloresDeJugadores[i]));
    }

    for(var i = 0; i < numRobots; i++){
        this.jugadores.push(jugador = new Jugador("c", this.coloresDeRobots[i]));
    }
    
   this.posicionDelJugadorDeTurno = 0;

    listaDeValoresDeMemoria = [];
    var idsDelMosaicoDeMemoria = [];
    this.mosaicosEncontrados = 0;
    var tipoCategoria;   

    this.obtenerSiguienteJugadorDeTurno = function() {
        return this.posicionDelJugadorDeTurno < this.jugadores.length - 1 ? this.posicionDelJugadorDeTurno + 1 : 0 ;
    }

    this.mostrarListaDeJugadores = function () {
        var tabla = '<table>';
        for (var i = 0; i < this.jugadores.length; i++) {
            tabla += '<tr><td style="width:20px;background-color:' + this.jugadores[i].color + '"></td>';
            tabla += '<td>' + this.jugadores[i].nombre + '</td>';
            tabla += '<td>' + this.jugadores[i].puntaje + '</td></tr>';
        }
        tabla += '</table>';
        document.getElementById('listajugadores').innerHTML = tabla;
    }
    this.mostrarListaDeJugadores();
    
    this.generarCartas = function(numParesCartas, categoriaDeCartas) {
        var listaDeMemoria = [];    
        if (categoriaDeCartas == "fr") {
        tipoCategoria = "Frutas y Vegetales";
        }
        else if (categoriaDeCartas == "an") {
            tipoCategoria = "Animales";
        }
        else {
            tipoCategoria = "Objetos";
        }
        for(var i = 0; i < numParesCartas; i++){
            listaDeMemoria.push(new Carta("" + i, 'img/' + categoriaDeCartas + i + '.jpg', tipoCategoria, "F"));
            listaDeMemoria.push(new Carta("" + i, 'img/' + categoriaDeCartas + i + '-w.jpg', tipoCategoria, "W"));
        }
        return listaDeMemoria;
    }   
    
    this.cartas = this.generarCartas(numParesCartas, categoriaDeCartas);

    this.barajarCartas = function(){
        var i = this.cartas.length, j, temp;
        while(--i > 0){
            j = Math.floor(Math.random() * (i+1));
            temp = this.cartas[j];
            this.cartas[j] = this.cartas[i];
            this.cartas[i] = temp;
        }
    }
    this.barajarCartas();

    this.reproducirSonidoVoltearCarta = function () {
        if (!this.audioVoltear) return;
        this.audioVoltear.currentTime = 0;
        this.audioVoltear.play();
    }

/////////////cartas tamano y categoria, add lista jugadores
    var salida = '';
        for(var i = 0; i < this.cartas.length; i++) {
            salida += '<div id="mosaico_'+i+'" onclick="juego.tablero.darVueltaAlMosaico(this,'+i+')"></div>';
        }
        document.getElementById('tableroDeMemoria').innerHTML = salida; 

      
    this.darVueltaAlMosaico = function (tile, val) {
            this.reproducirSonidoVoltearCarta();
            if(tile.innerHTML == "" && listaDeValoresDeMemoria.length < 2){
               var carta = this.cartas[val]; 
                tile.style.background = '#FFF';
                tile.innerHTML = '<img src="' + carta.textoImagen + '">'
            
                if(listaDeValoresDeMemoria.length == 0){
                    listaDeValoresDeMemoria.push(carta);
                    idsDelMosaicoDeMemoria.push(tile.id);
                } 
            
                else if(listaDeValoresDeMemoria.length == 1){
                    listaDeValoresDeMemoria.push(carta);
                    idsDelMosaicoDeMemoria.push(tile.id);
                    
                    //gano
                    if(listaDeValoresDeMemoria[0].codigo == listaDeValoresDeMemoria[1].codigo){
                        listaDeValoresDeMemoria[0].dueno = this.jugadores[this.posicionDelJugadorDeTurno];
                        listaDeValoresDeMemoria[1].dueno = this.jugadores[this.posicionDelJugadorDeTurno];
                        this.jugadores[this.posicionDelJugadorDeTurno].puntaje += 1;
                        this.mosaicosEncontrados += 2;
                        this.mostrarListaDeJugadores();
                        var mosaico1 = document.getElementById(idsDelMosaicoDeMemoria[0]);
                        var mosaico2 = document.getElementById(idsDelMosaicoDeMemoria[1]);
                        mosaico1.style.backgroundColor = mosaico2.style.backgroundColor = this.jugadores[this.posicionDelJugadorDeTurno].color;
                        mosaico1.getElementsByTagName('img')[0].style.opacity = mosaico2.getElementsByTagName('img')[0].style.opacity = 0.5;
                
                    
                        // Borrar el contenido de los array
                        listaDeValoresDeMemoria = [];
                        idsDelMosaicoDeMemoria = [];
                       
                    
                        // Verifique si todo el tablero está despejado
                        if(this.mosaicosEncontrados ==  this.cartas.length){
                            alert("Tablero despejado ... generando nuevo tablero");
                            document.getElementById('tableroDeMemoria').innerHTML = "";
                            //Tablero();
                        }
                    } 
                    //perdio
                    else {
                        this.posicionDelJugadorDeTurno = this.obtenerSiguienteJugadorDeTurno();
                        const flip2Back = () => {
                            mostrarCartaIndicada(listaDeValoresDeMemoria[0]);
                            // Voltea las 2 cartas nuevamente
                            var mosaico1 = document.getElementById(idsDelMosaicoDeMemoria[0]);
                            var mosaico2 = document.getElementById(idsDelMosaicoDeMemoria[1]);
                            mosaico1.style.background = 'url(img/logo.jpg) no-repeat';
                            mosaico1.innerHTML = "";
                            mosaico2.style.background = 'url(img/logo.jpg) no-repeat';
                            mosaico2.innerHTML = "";
                            // Borrar el contenido array
                            listaDeValoresDeMemoria = [];
                            idsDelMosaicoDeMemoria = [];
                            this.reproducirSonidoVoltearCarta();
                        }
                        setTimeout(flip2Back, 1000);    
                    }
                }
            }
        }           
}    

//CLASS
function Juego() {
    this.tamano;
    this.tablero;
    this.categoria;
    //this.numJugadores;
    //this.numRobots;
    
    this.presionarBotonDeDatosDelTablero = function() {
        numComputador = 1;
        numJugador = 1;
        this.tamano = parseInt(document.getElementById("tamanoTablero").value);
        this.categoria = document.getElementById("categoriaCartas").value;
        this.jugadores = document.getElementById("numeroDeJugadores").value;
        this.robots = document.getElementById("numeroDeRobots").value;

        if (this.tamano == 18){
            document.getElementById("tableroDeMemoria").style.width='440px';
            document.getElementById("tableroDeMemoria").style.height='430px';
            document.getElementById("tableroDeMemoria").style.background='red';  
        }
        else if (this.tamano == 32) {
            document.getElementById("tableroDeMemoria").style.width='576px';
            document.getElementById("tableroDeMemoria").style.height='565px';
            document.getElementById("tableroDeMemoria").style.background='green';
        }
        else {
            document.getElementById("tableroDeMemoria").style.width='288px';
            document.getElementById("tableroDeMemoria").style.height='290px';
            document.getElementById("tableroDeMemoria").style.background='blue';
        }
        this.tablero = new Tablero(this.tamano, this.categoria, this.jugadores, this.robots);
    }
 
    this.presionarBotonDeDatosDelTablero();
}

//CLASS
function Jugador(tipoJugador, color) {
    this.nombre = null;
    this.puntaje = 0;
    this.color = color;  
    this.tipoJugador = tipoJugador;

    if (this.tipoJugador == "c") {
        this.nombre = 'Computador' + numComputador;
        numComputador += 1;
      

    }
    else if (this.tipoJugador == "h") {
        this.nombre = 'Jugador' + numJugador;
        numJugador += 1;
    }
}


function mostrarCartaIndicada(carta) {
    salida = "";

    if (carta.tipoCategoria == "Frutas y Vegetales"){
        if (carta.tipoContenido == "F"){
            salida = 'fr' + carta.codigo + '-w.jpg';
        }
        else {
            salida = 'fr' + carta.codigo + '.jpg';
        }
        
    }

    else if (carta.tipoCategoria == "Animales") {
        if (carta.tipoContenido == "F") {
        salida = 'an' + carta.codigo + '-w.jpg';
        }
        else {
        salida = 'an' + carta.codigo + '.jpg';
        }
    }

    else{
        if (carta.tipoContenido == "F") {
            salida = 'ob' + carta.codigo + '-w.jpg';
            }
        else {
            salida = 'ob' + carta.codigo + '.jpg';
            }
    }

    salida = '<img src="img/' + salida + '">';
    document.getElementById('mosaicocorrectodeltablero').innerHTML = salida;  
    setTimeout(function() {
        document.getElementById('mosaicocorrectodeltablero').innerHTML = '';  
    }, 2000);   
}




juego = new Juego();

