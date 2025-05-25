const GameTime = require('../../modal/Adminmodal/gametimemodal');

// Convert time string (e.g., "10:30 AM") to Date in UTC for a given date
const convertToUTCDateTime = (dateStr, timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const [year, month, day] = dateStr.split('-').map(Number);

  // Create a UTC datetime
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
};

exports.setGameTime = async (req, res) => {
  try {
    const { gameType, openingTime, closingTime, date } = req.body;

    // Convert opening and closing times to UTC Date objects
    const openingDate = convertToUTCDateTime(date, openingTime);
    const closingDate = convertToUTCDateTime(date, closingTime);

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Normalize date to midnight UTC

    // Check if a game time already exists for the given game type and date
    let existing = await GameTime.findOne({ gameType, date: normalizedDate });

    if (existing) {
      // Update existing game time if found
      existing.openingTime = openingDate;
      existing.closingTime = closingDate;
      await existing.save();
      return res.json({ message: "Game time updated", data: existing });
    }

    // If no existing game time, create a new one
    const newTime = new GameTime({
      gameType,
      openingTime: openingDate,
      closingTime: closingDate,
      date: normalizedDate
    });

    await newTime.save();
    res.json({ message: "Game time set", data: newTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
