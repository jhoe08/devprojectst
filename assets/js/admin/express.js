const client = {
    timeCheck: document.getElementById('timeCheck'),
    feedItems: document.getElementsByClassName('feed-item')[0],
    timeLimit() {
        console.log('remove displayTimeLimit()')
    },
    init(func) {
        const _io = func

        _io.on('data2User', (data) => {
            console.log(data)
        })

        _io.on('notificationCount', (data) => {
            const notifCount = document.getElementById('notifDropdown');
            const {countNotif} = data
            // console.log(countNotif)
            if(notifCount) {
                if(countNotif > 100) { 
                    notifCount.querySelectorAll('.countNotif').textContent = '99+'
                } else {
                    notifCount.querySelectorAll('.countNotif').textContent = countNotif
                }
            }
            // notifCount.textContent = data.countNotif; // Update the count
          });
          
        _io.on('dateLang', (data) => {
            if(this.timeCheck) {
                this.timeCheck.innerHTML = data
            }
        })
        
        _io.on('sendAlert', (data) => {
            const { comment, refid, status, user } = data
            
            $.notify({ icon: 'icon-bell', title: `Trans ID #${refid} has updated`, message: `${comment} by <b>${user}</b>. <a href="/transactions/${refid}/remarks">Click here</a>`},
                { type: status, placement: { from: "top", align: "right" },
                time: 100000 });
            
        })

        if(this.feedItems) {
            const startDate = this.feedItems.dataset.startdate
            const dueDate = this.feedItems.dataset.duedate
            
            _io.emit('timeLimit', {
                startDate, dueDate            
            })
            _io.on('displayTimeLimit', (data) => {
                data = JSON.parse(data) 
                let {remainingHours, remainingMinutes, remainingSeconds} = data
                
                if(this.timeCheck){
                    if(remainingHours <= 0 && remainingMinutes <= 0 && remainingSeconds <= 0) {
                        console.log('Transaction being FLAGGED!')
                        _io.removeListener('displayTimeLimit', this.timeLimit())
                    }
                    // this.timeCheck.innerHTML = `${remainingHours}h: ${remainingMinutes}m: ${remainingSeconds}s`
                }
            })
        }
    }
}

export default {...client}