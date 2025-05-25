const SingleBet = require('../../modal/gamemodal/Singlemodal');
const DoubleBet = require('../../modal/gamemodal/Doublepanamodal');
const SinglePanaBet = require('../../modal/gamemodal/singlepanamodal');
const DoublePanaBet = require('../../modal/gamemodal/Doublepanamodal');
const TriplePanaBet = require('../../modal/gamemodal/TriplePanamodal');
const HalfSangamBet = require('../../modal/gamemodal/halfsangammodal');
const FullSangamBet = require('../../modal/gamemodal/fullsangammodal');

exports.getAllMyBets = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const [
        singleBets,
        doubleBets,
        singlePanaBets,
        doublePanaBets,
        triplePanaBets,
        halfSangamBets,
        fullSangamBets
      ] = await Promise.all([
        SingleBet.find({ user: userId }),
        DoubleBet.find({ user: userId }),
        SinglePanaBet.find({ user: userId }),
        DoublePanaBet.find({ user: userId }),
        TriplePanaBet.find({ user: userId }),
        HalfSangamBet.find({ user: userId }),
        FullSangamBet.find({ user: userId }),
      ]);
  
      res.status(200).json({
        success: true,
        message: 'All your game bets fetched successfully',
        data: {
          singleBets,
          doubleBets,
          singlePanaBets,
          doublePanaBets,
          triplePanaBets,
          halfSangamBets,
          fullSangamBets,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
