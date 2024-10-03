const _express = (io) => {
    
    const expressConnect = () => {
      io.on('connection', async (socket) => {
        
        const clientIpAddress = socket.request
        const socketID = socket.id
        const color = 'red'

     
        console.log('a user connected sdf', socket.id)

        ///////////////////////////
        socket.join(socketID)
        /////// USERS //////////
        io.to(socketID).emit('data2User', {'id': socketID, 'color': color})
        io.to(socketID).emit('userLogin', data => {

        })
        io.to(socketID).emit('userLogout', data => {

        })
        io.on('user login successfully', data => {
          console.log('user login successfully')
        })
        /////// DISCONNECT ///////
        socket.on('disconnect', () => {

        })
      })
    } 
  
    return {
      expressConnect
    }
  }
  
  module.exports = _express