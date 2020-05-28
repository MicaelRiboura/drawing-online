document.addEventListener('DOMContentLoaded',()=>{
    var i;
    const socket = io.connect()

    const colors = document.querySelectorAll('.color')
    const pincel =  {
        ativo: false,
        movendo: false,
        pos:{x:0,y:0},
        posAnterior: null,
        color: "red"
    }
    const tela = document.querySelector('#tela')
    const contexto = tela.getContext('2d')


    tela.width = 700
    tela.height = 500
    contexto.lineWidth = 7
    contexto.strokeStyle = pincel.color

    function changeColor(){
        let color = this.getAttribute('color')

        colors.forEach(c => c.classList.remove('active'))
        this.classList.add('active')
        pincel.color = color
    }

    colors.forEach(c => c.addEventListener('click', changeColor))

    const desenharLinha =  (linha) => {
        contexto.beginPath()
        contexto.moveTo(linha.posAnterior.x,linha.posAnterior.y)
        contexto.lineTo(linha.pos.x, linha.pos.y)
        contexto.stroke()
        contexto.strokeStyle = linha.color
    }

    // desenharLinha({pos:{x:350, y:250}, posAnterior:{x:10, y:10}})
     tela.onmousedown = (evento) => {pincel.ativo = true}
     tela.onmouseup = (evento) => {pincel.ativo = false}
     tela.onmousemove = (evento) => {
         pincel.pos.x = evento.clientX
         pincel.pos.y = evento.clientY
         pincel.movendo = true
     }

     const btnlimpar = document.querySelector('#limpar')
     btnlimpar.addEventListener("click", (evento)=>{
        console.log('foi')
        socket.emit('limpar', true)
     })

     socket.on('limpar',(e)=>{
        window.location.reload(true)
     })

     socket.on('desenhar', (linha) => {
         desenharLinha(linha)
     })

     const ciclo = ()=>{
         if(pincel.ativo && pincel.movendo && pincel.posAnterior){
             socket.emit('desenhar', {pos: pincel.pos, posAnterior: pincel.posAnterior, color: pincel.color})
             pincel.movendo = false
         }
         pincel.posAnterior = {x: pincel.pos.x, y: pincel.pos.y}
         setTimeout(ciclo, 10)
     }

     ciclo()
})