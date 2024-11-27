const client = {
    timeCheck: document.getElementById('timeCheck'),
    feedItems: document.getElementsByClassName('feed-item')[0],
    realtimeDivs: document.getElementsByClassName('realtime'),
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
            
            $.notify({ icon: 'icon-bell', title: `Trans ID #${refid} has updated`, message: `${comment} by <b>${user}</b>. <a href="/transactions/${refid}/view">Click here</a>`},
                { type: status, placement: { from: "top", align: "right" },
                time: 100000 });
            
        })

        _io.on('sendListsTransaction', (data) => {
            console.log('data', data)              
            let transactionsHistory = $('#transactionsHistory')
            
            data.forEach(item => {
                const transId = Object.keys(item)[0]; // Get the key (17256)
                let html = `<tr>
                    <th scope="row">
                        <button class="btn btn-icon btn-round btn-mute btn-sm me-2"><i class="fas fa-file-alt"></i></button>
                        Transaction ID <a href="/transactions/${transId}/view">#${transId}</a>
                    </th>
                    <td class="text-end">Mar 19, 2020, 2.45pm</td>
                    <td class="text-end">$250.00</td>
                    <td class="text-end">
                        <span class="badge badge-success">Completed</span>
                    </td>
                    </tr>`
            });
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
        
        _io.on('realtime', data =>{
            // console.log('realtime data', data)
            const divs = this.realtimeDivs
            const length = divs.length
            if(length) {
                divs[0].textContent = data
            }
        })
        
    }
}

export default {...client}