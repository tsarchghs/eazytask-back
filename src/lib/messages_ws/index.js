
module.exports = server => {
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        console.log("ON_CONNECTION")
        
        socket.on("send_message", msg => {
            io.to('task/' + msg.taskId).emit("share_message", msg);
        })
        
        socket.on("join_room", data => {
            socket.join(data.room_name)
            socket.to('some room')
        });

        socket.on("disconnect", () => {
            console.log("ON_DISCONNECTION")
        })
    })
}