const _tasks = (moment) => {
    const format = 'MMM DD YYYY hh:mm:ss a'
    const now = moment()
    let countNotif = 8;


    const incrementNotification = () => {
        return countNotif++;
    }
    
    const sendNotification = (task) => {
        console.log(`Notification: Task "${task.bid_notice_title}" is due now!`);
    }

    const checkDueNotifications = (lists) => {
        lists.forEach(task => {
            const {dueDate} = task
            const taskDueDate = moment(dueDate, format); // Convert the due date into a Moment object
            // Update fields 
            
            // console.log('task',task)
            // console.log('taskDueDate',taskDueDate)
            
            task.remarks = { notificationSent: false };
            const {notificationSent} = task.remarks

            // console.log('taskDueDate.isBefore(now)',taskDueDate.isBefore(now))
            // console.log('notificationSent',notificationSent)

            // Check if task is due and notification has not been sent
            if (taskDueDate.isBefore(now) && !notificationSent) {
                sendNotification(task);
                task.remarks = { ...task.remarks, notificationSent: true }; // Keep existing remarks and add notificationSent flag
            }
        });
    }

    return {
        checkDueNotifications, incrementNotification
    }
}

module.exports = _tasks