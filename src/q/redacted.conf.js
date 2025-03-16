const meow = {
    encode(str) {
        if (!str) return str
        let result = ''
        let len = str.length        
        for (let i = 0; i < len; i++) {
            str.replace('https://', '')
            const char = str[i]
            result += i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        }
        var endresult = result.replace('hvtrs8%', 'https%3A%2F%2F')

        return encodeURIComponent(endresult)
    },
    decode(str) {
        if (!str) return str
        str = decodeURIComponent(str)
        let result = ''
        let len = str.length
        for (let i = 0; i < len; i++) {
            const char = str[i]
            result += i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        }
        var endresult = result.replace(`hvtrs'3C%0F'2D`, 'htps://')
        return endresult
    },
}


self.__uv$config = {
    prefix: '/q/rockts/',
    bare: '/bare/',
    encodeUrl: meow.encode,
    decodeUrl: meow.decode,
    handler: '/q/redacted.hands.js',
    client: '/q/redacted.clients.js',
    bundle: '/q/redacted.with.js',
    config: '/q/redacted.conf.js',
    sw: '/q/redcted.sw.js'
};

