
const _express = (io, moment) => {
    const format = 'MMM DD YYYY hh:mm:ss a'
    const units = 'minutes' // hours, minutes, seconds
   
    const updateCountdown = (countdownEnd) => {
      const now = moment; // current time
      const remainingTime = countdownEnd.diff(now); // difference between current time and countdown end
  
      if (remainingTime <= 0) {
          console.log('Countdown finished!');
          clearInterval(interval); // Stop the countdown once it reaches zero
      } else {
          // Calculate remaining time in hours, minutes, and seconds
          const duration = moment.duration(remainingTime);
          const hours = duration.hours();
          const minutes = duration.minutes();
          const seconds = duration.seconds();
  
          console.log(`Remaining time: ${hours} hours ${minutes} minutes ${seconds} seconds`);
      }
    }
    const expressConnect = () => {
      io.on('connection', async (socket) => {
        
        const clientIpAddress = socket.request
        const socketID = socket.id
        const color = 'red'
     
        console.log('a user connected sdf', socket.id)

        ///////////////////////////
        socket.join(socketID)
        
          socket.on('timeLimit', (data)=>{
            const {startDate, dueDate} = data
            
            const startTime = moment(startDate, format);
          
            setInterval(()=>{
              const now = moment()
              const endTime = moment(dueDate, format);

              const duration = moment.duration(endTime.diff(now));
              
              const remainingHours = duration.hours();
              const remainingMinutes = duration.minutes();
              const remainingSeconds = duration.seconds();
              const html = `${remainingHours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds`
              // console.log(html)
              io.emit('displayTimeLimit', JSON.stringify({remainingHours, remainingMinutes, remainingSeconds}))
            }, 1000)
    
          })
        
      
       
        /////// DISCONNECT ///////
        socket.on('disconnect', () => {
          console.log('A user has terminated their connection to the server.')
        })
      })
    } 
  
    return {
      expressConnect
    }
  }
  
  module.exports = _express