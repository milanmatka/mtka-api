const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

const authRoutes = require('./Router/userouter');
const singledigitrouter = require('./Router/gamerouter/singledigitrouter');
const jodidigitrouter = require('./Router/gamerouter/jodigitrouter');
const singlepanarouter = require('./Router/gamerouter/singlepanarouter');
const doublepanrouter = require('./Router/gamerouter/doublepanrouter');
const TriplePanarouter = require('./Router/gamerouter/TriplePanarouter');
const halfsangam = require('./Router/gamerouter/halfsangamrouter');
const fullsangam = require('./Router/gamerouter/fullsangamrouter');
const walletRouter = require('./Router/walletRouter/walletRouter');
const withdrawalrouter = require('./Router/walletRouter/withdrawalrouter');

const allbeatrouter = require('./Router/gamerouter/allbeatrouter');
const starlineGame = require('./Router/starlineGameRoutes/starlineGameRoutes');
const galidesawar = require('./Router/galidesawarRoutes/galidesawarRoutes');


const starlineGameRoutes = require("./Router/starlineGameRoutes/starlineGameRoutes");
const starlineBetRoutes = require("./Router/starlineGameRoutes/starlineBetRoutes");
const starlineResultRoutes = require("./Router/starlineGameRoutes/starlineResultRoutes");

// admin routers
const homeDpRoutes = require('./Router/Adminrouter/homedprouter');
const gametimerouter = require('./Router/Adminrouter/gametimerouter');
const Resultgamerouter = require('./Router/Adminrouter/resultrouter/Resultgamerouter');
const cors = require('cors');
// const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/sigle', singledigitrouter);
app.use('/api/jodi', jodidigitrouter);
app.use('/api/singlepana', singlepanarouter);
app.use('/api/doublepana', doublepanrouter);
app.use('/api/TriplePana', TriplePanarouter);
app.use('/api/halfsangam', halfsangam);
app.use('/api/fullsangam', fullsangam);
app.use('/api/wallet', walletRouter);
app.use('/api/withdrawal', withdrawalrouter);

app.use('/api/allbeat', allbeatrouter);
app.use('/api/starline', starlineGame);
app.use('/api/galidesawar', galidesawar);


app.use("/api/starline/game", starlineGameRoutes);
app.use("/api/starline/bet", starlineBetRoutes);
app.use("/api/starline/result", starlineResultRoutes);





app.use('/api/homedp', homeDpRoutes);
app.use('/api/gametime', gametimerouter);
app.use('/api/game-result', Resultgamerouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
