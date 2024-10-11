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

        _io.on('user', (data) => {
            console.log()
        })
        _io.on('dateLang', (data) => {
            if(this.timeCheck) {
                this.timeCheck.innerHTML = data
            }
            
            // console.log('asdws-', data)
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
                    this.timeCheck.innerHTML = `${remainingHours}h: ${remainingMinutes}m: ${remainingSeconds}s`
                }
            })
        }
    }
}

export default {...client}