

class AllocatedFundsController {
  static async list(req, res) {
    
    res.render('allocatedFunds/list', { funds });
  }
}