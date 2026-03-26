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

  // =========================
  // ADMIN DASHBOARD ROOM
  // =========================
  socket.on("join_admin_dashboard", () => {
    console.log("[SOCKET] admin joined dashboard", socket.id)
    socket.join("admin_dashboard")
  })

  // server.js

socket.on("join_conversation", async (conversationId) => {
  try {
    // 1. User masuk ke room-nya sendiri
    socket.join(conversationId);
    console.log(`[SOCKET] User joined room: ${conversationId}`);

    // 2. Ambil data percakapan + info user dari DB
    // Pastikan include user agar Admin tahu namanya
    const conversation = await dbCon.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        user: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 } 
      }
    });

    if (conversation) {
      // 3. Kirim data lengkap ke room admin_dashboard
      // Ini yang bikin user baru "muncul tiba-tiba" di sidebar admin
      io.to("admin_dashboard").emit("new_conversation", conversation);
    }
  } catch (error) {
    console.error("Error in join_conversation socket:", error);
  }
});

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId)
    console.log("[SOCKET] leave room", {
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

      // notify admin dashboard kalau ini chat baru / update
      io.to("admin_dashboard").emit("conversation_updated", {
        conversationId,
        lastMessage: message.content,
        senderType: message.senderType,
        createdAt: message.createdAt
      })

      console.log("[SOCKET] message broadcasted", {
        conversationId,
        messageId: message.id
      })

    } catch (error) {
      console.error("[SOCKET] send_message error", error)
    }
  })

  // Di dalam io.on("connection", (socket) => { ...

socket.on("start_conversation", async (data) => {
  try {
    const { userId, userName } = data;
    
    // 1. Cari atau buat conversation baru di DB
    // Supaya meskipun belum ada pesan, record-nya sudah ada
    let conversation = await dbCon.conversation.findFirst({
      where: { userId: userId },
      include: { user: true }
    });

    if (!conversation) {
      conversation = await dbCon.conversation.create({
        data: { userId: userId },
        include: { user: true }
      });
    }

    // 2. Join room conversation tersebut
    socket.join(conversation.id);

    // 3. Beri tahu admin bahwa ada user baru online/standby
    io.to("admin_dashboard").emit("new_conversation", conversation);

    console.log(`[SOCKET] User ${userName} started/joined: ${conversation.id}`);
  } catch (error) {
    console.error("[SOCKET] start_conversation error", error);
  }
});

  socket.on("disconnect", () => {
    console.log("[SOCKET] user disconnected:", socket.id)
  })
})

server.listen(3001, () => {
  console.log("[SOCKET] Socket server running on port 3001")
})