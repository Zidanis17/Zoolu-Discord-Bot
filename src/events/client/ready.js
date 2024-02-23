const blackListModels = require('../../Schemas/blacklistmodels')

module.exports = async (Discord, client) => {
    client.user.setPresence({ activities: [{ name: 'My Reality Falling Apart' , type: 'WATCHING'}], status: 'online' });
    console.log('Zoolu is online!')

    setInterval(async () => {
        const allEntries = await blackListModels.find()
        for(const entry of allEntries){          
            if(entry.duration !== 'none'){
                if(entry.duration < Date.now()){
                    entry.remove()
                }
            }
        }
    }, 180000)
}