const client = {
    init(func) {
        const _io = func

        _io.on('data2User', (data) => {
            console.log(data)
        })

        _io.on('user', (data) => {
            console.log()
        })
    }
}

export default {...client}