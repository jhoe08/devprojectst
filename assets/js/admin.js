import preDefaultData from './const.js'

const main = {
  init() {
    preDefaultData.BLOOD_TYPE()
    console.log(preDefaultData.BLOOD_TYPE())
  }
}

main.init()

const _admin = {
    user: document.getElementById('asdf'),
    logonDetails(user) {
        return (`
            <div class="u-text">
                <h4>${user.fullname}</h4>
                <p class="text-muted">${user.email}</p>
                <a
                    href="profile.html"
                    class="btn btn-xs btn-secondary btn-sm"
                    >View Profile</a
                >
            </div>`)
    }
}


let admin = new _admin()
let fetchData = {
    'fullname':'Just Test',
    'email':'justtest@example.com',
}
admin.logonDetails(fetchData)