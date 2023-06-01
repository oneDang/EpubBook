<template>
    <!-- 上传图书 -->
    <div id="app">
        <div class="chat-container">
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="message.type">
                    {{ message.content }}
                </div>
            </div>
            <div class="input-container">
                <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message" />
                <button @click="sendMessage">发送</button>
                <button @click="saveChat">保存聊天记录</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            userInput: '',
            messages: []
        }
    },
    methods: {
        async sendMessage () {
            if (!this.userInput) return

            this.messages.push({ type: 'user', content: this.userInput })

            const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
                prompt: `User: ${this.userInput}\nChatGPT: `,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.7
            }, {
                headers: {
                    Authorization: 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            })

            const chatGPTResponse = response.data.choices[0].text.trim()
            this.messages.push({ type: 'chatgpt', content: chatGPTResponse })

            this.userInput = ''
        },
        saveChat () {
            const chatLog = this.messages.map(message => `${message.type === 'user' ? 'User' : 'ChatGPT'}: ${message.content}`).join('\n')
            const blob = new Blob([chatLog], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'chat_log.txt'
            link.click()
        }
    }
}
</script>

<style scoped>
.chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    font-family: Arial, sans-serif;
}

.messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.input-container {
    display: flex;
    justify-content: space-between;
}

input {
    flex-grow: 1;
    margin-right: 1rem;
}

.user {
    text-align: right;
    color: blue;
}

.chatgpt {
    text-align: left;
    color: green;
}
</style>
