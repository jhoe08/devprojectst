const _tasks = (moment) => {
    const format = 'MMM DD YYYY hh:mm:ss a'
    const now = moment()
    let countNotif = 8;


    const incrementNotification = () => {
        return countNotif++;
    }
    
    const sendNotification = (task) => {
        console.log(`Notification: Transactions "${task.refid}" is due now!`);
    }

    const checkDueNotifications = (lists) => {
        let allDatesToday = [];
        let uniqueRefids = {};  // To keep track of unique refid values
    
        lists.forEach(task => {
            const { id, refid, dueDate } = task;
            
            // Get the start and end of today
            const startOfDay = moment().startOf('day');  // Start of today (00:00:00)
            const endOfDay = moment().endOf('day');      // End of today (23:59:59)
    
            let currentDate = moment(dueDate);
    
            // Check if the due date is within today's range
            if (currentDate.isBetween(startOfDay, endOfDay, null, '[]')) {
    
                // If refid hasn't been added yet, add it to the allDatesToday array
                // if (!uniqueRefids[refid]) {
                //     uniqueRefids[refid] = true;  // Mark this refid as processed
    
                    // Create a new entry object to store in the array
                    const newEntry = { [refid]: { id, date: currentDate.format('YYYY-MM-DD HH:mm:ss') } };
    
                    allDatesToday.push(newEntry);
                // }
            }
        });
    
        console.log('allDatesToday', allDatesToday);
    }
    

    return {
        checkDueNotifications, incrementNotification
    }
}

module.exports = _tasks