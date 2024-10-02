import client from './admin/express.js'

const main = {
  init(func) {
    client.init(func)
  }
}

main.init(io())