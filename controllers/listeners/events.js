async function init(app) {
    app.event('reaction_added', async ({ event, client, context }) => {
        
        console.log("catch");
      });

}
module.exports = {
    init
};