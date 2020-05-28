const express = require('express')
const app = express()

// app.listen(8080,()=>{
//     console.log('Executando...')
// })
// Outra forma de iniciar o Servidor:
const http = require('http')
const server = http.createServer(app)

const socketIo = require('socket.io')
const io = socketIo.listen(server)

server.listen(3000,()=>{
    console.log('Executando Socket IO...')
})

app.use(express.static(__dirname + "/public"))

var historico = []

io.on('connection',(socket)=>{
    historico.forEach(linha => {
        socket.emit('desenhar',linha)
    })
    socket.on('limpar',(value)=>{
        if(value) historico = []
        io.emit('limpar', {pos:{x:0,y:0}, posAnterior: null})
    })
    socket.on('desenhar', (linha) => {
        historico.push(linha)
        io.emit('desenhar', linha)


    })
})

