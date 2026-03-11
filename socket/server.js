import { Server } from "socket.io"
import http from "http"
import { dbCon } from "./dbConnection.js"

const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("[SOCKET] User connected:", socket.id)

  socket.on("join_conversation", (conversationId) => {
    console.log("[SOCKET] join_conversation request", {
      socketId: socket.id,
      conversationId
    })

    socket.join(conversationId)

    console.log("[SOCKET] joined room", {
      socketId: socket.id,
      room: conversationId
    })
  })

  socket.on("send_message", async (data) => {
    try {
      console.log("[SOCKET] send_message received", data)

      const { conversationId, senderType, senderId, content } = data

      const message = await dbCon.message.create({
        data: {
          conversationId,
          senderType,
          senderId,
          content
        }
      })

      console.log("[SOCKET] message saved to DB", message)

      io.to(conversationId).emit("receive_message", message)

      console.log("[SOCKET] message broadcasted", {
        conversationId,
        messageId: message.id
      })

    } catch (error) {
      console.error("[SOCKET] send_message error", error)
    }
  })

  socket.on("disconnect", () => {
    console.log("[SOCKET] user disconnected:", socket.id)
  })
})

server.listen(3001, () => {
  console.log("[SOCKET] Socket server running on port 3001")
})