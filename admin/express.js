// THIS MUST BE READ FIRST
// This is admin node

const _express = (io, moment) => {
    const format = 'MMM DD YYYY hh:mm:ss a'
    const units = 'minutes' // hours, minutes, seconds
    let countNotif = 0;
    
    const getCountNotif = (data) => {
      return data
    }
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
        console.log(`A user connected with Socket ID: ${socketID} from IP: ${clientIpAddress.connection.remoteAddress}`);
        ///////////////////////////
        socket.join(socketID)
        // socket.emit('notificationCount', { countNotif });

        setInterval(function(){
          countNotif++;
          // socket.emit('notificationCount', { countNotif }); // Emit to all connected clients
          socket.emit('realtime', moment().format(format))
          // console.log(countNotif)
        }, 1000);

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

        socket.on('notificationLists', (data) => {
          console.log('Notification Lists Event Triggered', data)
        })

        console.log('Emitting retrieveActitivities with:', socketID);
        socket.emit('retrieveActitivities', socketID || 'No ID');

        socket.on('displayActivities', data => {
          console.log('Server: Display Activities Event Triggered admin/express', data)
        })
        

        // Listen for client disconnection and log the event for monitoring purposes
        socket.on('disconnect', () => {
          console.log('A user has terminated their connection to the server.');
        });
      })

      io.on('noficationLists', (data)=>{
        console.log('Notification Event Triggered', data)
      })
    } 

    const expressActivityLog = (data) => {
      // console.log('Activity Log Event Triggered admin/express', data)
    
    }
  
    return {
      expressConnect, getCountNotif, expressActivityLog
    }
  }
  
  module.exports = _express